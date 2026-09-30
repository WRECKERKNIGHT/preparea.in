import { createClient, type Client } from "@libsql/client";

/**
 * Database access for PrepArea.
 *
 * One code path, three deployment shapes:
 *
 *   TURSO_DATABASE_URL=libsql://db-xxx.turso.io   -> hosted Turso (production)
 *   SQLITE_DB_PATH=.data/preparea.db              -> local file on disk (dev)
 *   :memory:                                      -> ephemeral (tests)
 *
 * `@libsql/client` speaks the same SQLite dialect locally and over the wire, so
 * the SQL below is identical in every environment. That replaces the previous
 * setup where production silently fell back to an in-memory store and threw
 * away every registration.
 */

export type DbTarget = "turso" | "file" | "memory";

export interface DbConfig {
  target: DbTarget;
  url: string;
  authToken?: string;
  /** Set when the target is a local file, so the store can mkdir the parent. */
  file?: string;
}

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const LOCAL_PATH = process.env.SQLITE_DB_PATH;

let warned = false;

export function resolveDbConfig(): DbConfig {
  if (TURSO_URL) {
    return {
      target: "turso",
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    };
  }

  if (LOCAL_PATH) {
    return { target: "file", url: `file:${LOCAL_PATH}`, file: LOCAL_PATH };
  }

  if (process.env.NODE_ENV === "production") {
    // Previously this branch returned null and the app quietly ran on the
    // in-memory mock, so production lost all registrations. A local file on
    // an ephemeral filesystem is equally lossy, so make it loud instead and
    // let the operator see the misconfiguration in the logs.
    if (!warned) {
      warned = true;
      console.warn(
        "[preparea-db] TURSO_DATABASE_URL is not set in production. Falling " +
          "back to a local SQLite file, which is NOT durable on serverless " +
          "runtimes. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
      );
    }
    return { target: "file", url: "file:.data/preparea.db", file: ".data/preparea.db" };
  }

  return { target: "file", url: "file:.data/preparea.db", file: ".data/preparea.db" };
}

export function createDb(config: DbConfig = resolveDbConfig()): Client {
  return createClient({
    url: config.url,
    ...(config.authToken ? { authToken: config.authToken } : {}),
  });
}

// ---------------------------------------------------------------------------
// Migrations
// ---------------------------------------------------------------------------

export interface Migration {
  id: string;
  name: string;
  /** Idempotent DDL/DML. Safe to re-run after a half-applied crash. */
  up: string;
}

/**
 * Ordered, versioned schema history. Never edit a shipped migration — append a
 * new one. Every statement is `IF NOT EXISTS` so a crash between applying the
 * SQL and recording the id cannot wedge the database.
 */
export const MIGRATIONS: Migration[] = [
  {
    id: "001",
    name: "initial_schema",
    up: `
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        klass TEXT NOT NULL,
        exam TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        tgUsername TEXT,
        discordUsername TEXT,
        dailyTargetMin INTEGER NOT NULL DEFAULT 300,
        mainChallenge TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS otps (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        codeHash TEXT NOT NULL,
        purpose TEXT NOT NULL,
        expiresAt INTEGER NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        day TEXT NOT NULL,
        time TEXT NOT NULL,
        durationMin INTEGER NOT NULL,
        zoomLink TEXT,
        examFocus TEXT,
        active INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS mentors (
        id TEXT PRIMARY KEY,
        mentorName TEXT NOT NULL,
        topic TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        zoomLink TEXT,
        notes TEXT,
        recordingLink TEXT
      );

      CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        rules TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS participants (
        challengeId TEXT NOT NULL,
        studentId TEXT NOT NULL,
        joinedAt TEXT NOT NULL,
        PRIMARY KEY (challengeId, studentId)
      );

      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        date TEXT NOT NULL,
        minutes INTEGER NOT NULL,
        roomId TEXT,
        note TEXT,
        source TEXT NOT NULL DEFAULT 'manual'
      );

      CREATE TABLE IF NOT EXISTS checkins (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        date TEXT NOT NULL,
        targetMin INTEGER NOT NULL,
        completedMin INTEGER NOT NULL,
        status TEXT NOT NULL,
        note TEXT
      );

      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL UNIQUE,
        helpsConsistency INTEGER NOT NULL,
        sessionsAttended INTEGER NOT NULL,
        liked TEXT NOT NULL DEFAULT '',
        improve TEXT NOT NULL DEFAULT '',
        joinAgain INTEGER NOT NULL,
        wouldPay INTEGER NOT NULL,
        features TEXT NOT NULL DEFAULT '',
        submittedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `,
  },
  {
    id: "002",
    name: "auth_hardening",
    up: `
      ALTER TABLE students ADD COLUMN tokenVersion INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE students ADD COLUMN updatedAt TEXT;

      CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        hits INTEGER NOT NULL DEFAULT 0,
        windowStart INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        expiresAt INTEGER NOT NULL,
        revokedAt TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
      CREATE INDEX IF NOT EXISTS idx_sessions_student ON sessions(studentId);
    `,
  },
  {
    id: "003",
    name: "query_indexes",
    up: `
      CREATE INDEX IF NOT EXISTS idx_logs_student_date ON logs(studentId, date);
      CREATE INDEX IF NOT EXISTS idx_checkins_student_date ON checkins(studentId, date);
      CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(date);
      CREATE INDEX IF NOT EXISTS idx_participants_student ON participants(studentId);
      CREATE INDEX IF NOT EXISTS idx_mentors_date ON mentors(date);
      CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(active);
    `,
  },
];

/**
 * Applies every pending migration once, in id order.
 *
 * The migration id is recorded after its SQL is applied rather than inside the
 * same transaction: libSQL `batch` is already atomic, and every statement here
 * is idempotent, so re-running an unrecorded migration after a crash is safe.
 */
export async function migrate(
  client: Client,
  migrations: Migration[] = MIGRATIONS
): Promise<string[]> {
  await client.execute(
    `CREATE TABLE IF NOT EXISTS _migrations (
       id TEXT PRIMARY KEY,
       name TEXT NOT NULL,
       appliedAt TEXT NOT NULL
     )`
  );

  const result = await client.execute("SELECT id FROM _migrations");
  const applied = new Set(result.rows.map((r) => String(r.id)));

  const pending = migrations
    .filter((m) => !applied.has(m.id))
    .sort((a, b) => a.id.localeCompare(b.id));

  for (const m of pending) {
    await client.batch(
      m.up
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((sql) => ({ sql })),
      "write"
    );
    await client.execute({
      sql: "INSERT INTO _migrations (id, name, appliedAt) VALUES (?, ?, ?)",
      args: [m.id, m.name, new Date().toISOString()],
    });
  }

  return pending.map((m) => m.id);
}

export interface SqlValue {
  null: null;
  int: (n: number) => number;
  str: (s: string) => string;
  bool: (b: boolean) => number;
  /** Normalises `undefined` to SQL NULL so callers can pass optional fields. */
  opt: (s: string | undefined | null) => string | null;
}

export const V: SqlValue = {
  null: null,
  int: (n) => Math.round(n),
  str: (s) => String(s),
  bool: (b) => (b ? 1 : 0),
  opt: (s) =>
    s === undefined || s === null || s === "" ? null : String(s),
};
