import { createRequire } from "node:module";
import type { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { nanoid } from "nanoid";
import type {
  Student,
  Room,
  MentorSession,
  Challenge,
  Checkin,
  StudyLog,
  FeedbackInput,
  DashboardMe,
  CheckinInput,
  StudyLogInput,
  RegisterInput,
  PublicSettings,
  ChallengeParticipant,
  CheckinStatus,
} from "@preparea/shared";
import { normalizeEmail, isEmail, otpCode, minMax, trialInfo } from "@preparea/shared";
import type { Store } from "@/lib/store";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayKey(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hash(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

let DatabaseSyncCtor: typeof DatabaseSync | null | undefined;

/**
 * node:sqlite is only unflagged from Node 23.4+. We detect support at runtime
 * and load lazily so older runtimes (e.g. an existing Vercel Node 22 build)
 * fall back to the mock/Sheets store instead of crashing on import.
 */
function getDatabaseSync(): typeof DatabaseSync | null {
  if (DatabaseSyncCtor !== undefined) return DatabaseSyncCtor;
  DatabaseSyncCtor = null;
  try {
    const requireFrom = createRequire(import.meta.url);
    const mod = requireFrom("node:sqlite") as typeof import("node:sqlite");
    DatabaseSyncCtor = mod.DatabaseSync;
  } catch {
    DatabaseSyncCtor = null;
  }
  return DatabaseSyncCtor;
}

/**
 * A real, persistent SQLite-backed store. Uses Node's built-in `node:sqlite`
 * so there are no native packages to install — local development keeps
 * durable data without any external account. When Google Sheets credentials
 * are present, `getStore()` chooses the Sheets backend (production).
 */
export class SqliteStore implements Store {
  private db: DatabaseSync;

  constructor(file: string) {
    const ctor = getDatabaseSync();
    if (!ctor) throw new Error("node:sqlite is not available on this runtime.");
    if (file && file !== ":memory:") {
      mkdirSync(dirname(file), { recursive: true });
    }
    this.db = new ctor(file);
    this.migrate();
    this.seed();
  }

  isMock() {
    return false;
  }

  // -------------------------------------------------------------------------
  // Schema + seed
  // -------------------------------------------------------------------------

  private migrate() {
    this.db.exec(`
      PRAGMA journal_mode = WAL;

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
        email TEXT NOT NULL,
        codeHash TEXT NOT NULL,
        purpose TEXT NOT NULL,
        expiresAt INTEGER NOT NULL
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
        studentId TEXT NOT NULL,
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
    `);
  }

  private seed() {
    const count = this.db.prepare("SELECT COUNT(*) AS n FROM students").get() as {
      n: number;
    };
    if (count.n > 0) return;

    const seen = new Set<string>();
    const insert = <T>(table: string, cols: string[], row: T) => {
      const key = (row as { id?: string }).id;
      if (key && seen.has(key)) return;
      if (key) seen.add(key);
      this.db
        .prepare(
          `INSERT INTO ${table} (${cols.join(",")}) VALUES (${cols.map((c) => `@${c}`).join(",")})`
        )
        .run(row as unknown as Record<string, never>);
    };

    insert(
      "students",
      ["id", "name", "klass", "exam", "email", "tgUsername", "dailyTargetMin", "mainChallenge", "status", "createdAt"],
      {
        id: "demo-1",
        name: "Demo Aspirant",
        klass: "12",
        exam: "JEE",
        email: "demo@preparea.in",
        tgUsername: "@demoaspirant",
        dailyTargetMin: 300,
        mainChallenge: "Procrastination",
        status: "active",
        createdAt: dayKey(-12),
      } as Student
    );
    insert("students", ["id", "name", "klass", "exam", "email", "dailyTargetMin", "status", "createdAt"], {
      id: "member-2",
      name: "Ananya S.",
      klass: "11",
      exam: "NEET",
      email: "ananya@example.com",
      dailyTargetMin: 240,
      status: "active",
      createdAt: dayKey(-5),
    } as Partial<Student>);
    insert("students", ["id", "name", "klass", "exam", "email", "dailyTargetMin", "status", "createdAt"], {
      id: "member-3",
      name: "Arjun K.",
      klass: "12",
      exam: "JEE",
      email: "arjun@example.com",
      dailyTargetMin: 360,
      status: "active",
      createdAt: dayKey(-4),
    } as Partial<Student>);
    insert("students", ["id", "name", "klass", "exam", "email", "dailyTargetMin", "status", "createdAt"], {
      id: "member-4",
      name: "Pooja M.",
      klass: "Dropper",
      exam: "NEET",
      email: "pooja@example.com",
      dailyTargetMin: 420,
      status: "member",
      createdAt: dayKey(-3),
    } as Partial<Student>);

    const rooms: (Omit<Room, "active"> & { active: number })[] = [
      { id: "room-morning", name: "Morning Focus", day: "6:00 – 8:00 AM", time: "06:00", durationMin: 120, zoomLink: "https://zoom.us/j/preparea-morning", examFocus: "All exams", active: 1 },
      { id: "room-afternoon", name: "Afternoon Focus", day: "1:00 – 3:00 PM", time: "13:00", durationMin: 120, zoomLink: "https://zoom.us/j/preparea-afternoon", examFocus: "All exams", active: 1 },
      { id: "room-evening", name: "Evening Focus", day: "6:00 – 9:00 PM", time: "18:00", durationMin: 180, zoomLink: "https://zoom.us/j/preparea-evening", examFocus: "All exams", active: 1 },
      { id: "room-night", name: "Night Focus", day: "10:00 PM – 12:00 AM", time: "22:00", durationMin: 120, zoomLink: "https://zoom.us/j/preparea-night", examFocus: "All exams", active: 1 },
    ];
    for (const r of rooms) insert("rooms", ["id", "name", "day", "time", "durationMin", "zoomLink", "examFocus", "active"], r);

    const mentors: MentorSession[] = [
      { id: "mentor-1", mentorName: "Rohit (NIT Trichy)", topic: "How I planned my JEE preparation", date: dayKey(2), time: "7:00 PM", notes: "30 minutes talk + Q&A" },
      { id: "mentor-2", mentorName: "Shreya (AIIMS)", topic: "Revision strategy that actually sticks", date: dayKey(5), time: "7:00 PM", notes: "45 minutes including Q&A" },
      { id: "mentor-3", mentorName: "Karan (IIIT Hyderabad)", topic: "Staying consistent for 7 months", date: dayKey(8), time: "7:00 PM", notes: "Open conversation" },
    ] as MentorSession[];
    for (const m of mentors) insert("mentors", ["id", "mentorName", "topic", "date", "time", "zoomLink", "notes", "recordingLink"], m);

    const challenge: Omit<Challenge, "active"> & { active: number } = {
      id: "challenge-7day",
      name: "7-Day Study Consistency Challenge",
      type: "7day",
      startDate: dayKey(-3),
      endDate: dayKey(3),
      rules: "Set a target each morning. Study. Check in each evening. Missed a day? Tomorrow counts.\n\nKeep it personal — no comparing hours with others.",
      active: 1,
    };
    insert("challenges", ["id", "name", "type", "startDate", "endDate", "rules", "active"], challenge);

    const parts: ChallengeParticipant[] = [
      { challengeId: "challenge-7day", studentId: "demo-1", joinedAt: dayKey(-3) },
      { challengeId: "challenge-7day", studentId: "member-2", joinedAt: dayKey(-3) },
      { challengeId: "challenge-7day", studentId: "member-3", joinedAt: dayKey(-2) },
    ];
    for (const p of parts) insert("participants", ["challengeId", "studentId", "joinedAt"], p);

    const seed = [
      [6, 210, "hit"],
      [5, 300, "hit"],
      [4, 180, "partial"],
      [3, 330, "hit"],
      [2, 270, "hit"],
      [1, 240, "partial"],
    ] as const;
    for (const [offset, minutes, status] of seed) {
      const d = new Date();
      d.setDate(d.getDate() - offset);
      const k = localDateKey(d);
      const id = nanoid(8);
      insert("logs", ["id", "studentId", "date", "minutes", "roomId", "note", "source"], {
        id,
        studentId: "demo-1",
        date: k,
        minutes,
        source: "timer",
      } as StudyLog);
      insert("checkins", ["id", "studentId", "date", "targetMin", "completedMin", "status", "note"], {
        id: nanoid(8),
        studentId: "demo-1",
        date: k,
        targetMin: 300,
        completedMin: minutes,
        status,
      } as Checkin);
    }

    const settings: PublicSettings = {
      announcement:
        "7-Day Challenge cohort is live. Evening check-ins before 11 PM, please.",
      activeChallengeId: "challenge-7day",
      telegramUrl: "https://t.me/preparea_announcements",
      discordUrl: "https://discord.gg/preparea",
    };
    const setStmt = this.db.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING"
    );
    for (const [k, v] of Object.entries(settings)) {
      if (v) setStmt.run(k, String(v));
    }
  }

  // -------------------------------------------------------------------------
  // Students
  // -------------------------------------------------------------------------

  private toStudent(r: Record<string, unknown>): Student | null {
    if (!r.id || !r.name || !r.email) return null;
    return {
      id: String(r.id),
      name: String(r.name),
      klass: String(r.klass ?? ""),
      exam: String(r.exam ?? ""),
      email: String(r.email),
      tgUsername: r.tgUsername ? String(r.tgUsername) : undefined,
      discordUsername: r.discordUsername ? String(r.discordUsername) : undefined,
      dailyTargetMin: Number(r.dailyTargetMin) || 300,
      mainChallenge: r.mainChallenge ? String(r.mainChallenge) : undefined,
      status: (r.status as Student["status"]) ?? "new",
      createdAt: String(r.createdAt ?? new Date().toISOString()),
    };
  }

  async findStudentByEmail(email: string) {
    const row = this.db
      .prepare("SELECT * FROM students WHERE lower(email) = ?")
      .get(normalizeEmail(email)) as Record<string, unknown> | undefined;
    return row ? this.toStudent(row) : null;
  }

  async getStudent(id: string) {
    const row = this.db
      .prepare("SELECT * FROM students WHERE id = ?")
      .get(id) as Record<string, unknown> | undefined;
    return row ? this.toStudent(row) : null;
  }

  async registerStudent(input: RegisterInput) {
    if (!input.name.trim()) throw new Error("Name is required.");
    if (!isEmail(input.email)) throw new Error("Valid email is required.");
    if (!input.klass || !input.exam)
      throw new Error("Class and exam are required.");
    if (!minMax(input.dailyTargetMin, 15, 720))
      throw new Error("Daily target must be 15–720 minutes.");
    if (await this.findStudentByEmail(input.email))
      throw new Error("This email is already registered.");

    const student: Student = {
      id: nanoid(10),
      name: input.name.trim(),
      klass: input.klass,
      exam: input.exam,
      email: normalizeEmail(input.email),
      tgUsername: input.tgUsername?.trim() || undefined,
      discordUsername: input.discordUsername?.trim() || undefined,
      dailyTargetMin: input.dailyTargetMin,
      mainChallenge: input.mainChallenge || undefined,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    const bind = Object.fromEntries(
      Object.entries(student).map(([k, v]) => [k, v === undefined ? null : v])
    );
    this.db
      .prepare(
        `INSERT INTO students (id,name,klass,exam,email,tgUsername,discordUsername,dailyTargetMin,mainChallenge,status,createdAt)
         VALUES (@id,@name,@klass,@exam,@email,@tgUsername,@discordUsername,@dailyTargetMin,@mainChallenge,@status,@createdAt)`
      )
      .run(bind as unknown as Record<string, never>);
    return student;
  }

  async updateStudent(id: string, patch: Partial<Student>) {
    const keys = Object.keys(patch).filter((k) =>
      [
        "name",
        "klass",
        "exam",
        "tgUsername",
        "discordUsername",
        "dailyTargetMin",
        "mainChallenge",
        "status",
      ].includes(k)
    );
    if (keys.length === 0) return this.getStudent(id);
    const assignments = keys.map((k) => `${k} = @${k}`).join(", ");
    const row: Record<string, unknown> = { id, ...patch };
    const bind = Object.fromEntries(
      Object.entries(row).map(([k, v]) => [k, v === undefined ? null : v])
    );
    this.db.prepare(`UPDATE students SET ${assignments} WHERE id = @id`).run(bind as unknown as Record<string, never>);
    return this.getStudent(id);
  }

  // -------------------------------------------------------------------------
  // OTP
  // -------------------------------------------------------------------------

  async requestOtp(email: string, purpose: string) {
    const code = otpCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    this.db
      .prepare("INSERT INTO otps (email, codeHash, purpose, expiresAt) VALUES (?, ?, ?, ?)")
      .run(normalizeEmail(email), hash(normalizeEmail(email) + purpose + code), purpose, expiresAt);
    this.db
      .prepare(
        "DELETE FROM otps WHERE email = ? AND rowid NOT IN (SELECT rowid FROM otps WHERE email = ? ORDER BY rowid DESC LIMIT 5)"
      )
      .run(email, email);
    return { code };
  }

  async verifyOtp(email: string, code: string) {
    const now = Date.now();
    const row = this.db
      .prepare("SELECT * FROM otps WHERE lower(email) = ? AND expiresAt > ? ORDER BY rowid DESC LIMIT 1")
      .get(normalizeEmail(email), now) as Record<string, unknown> | undefined;
    if (!row || hash(normalizeEmail(email) + String(row.purpose) + code.trim()) !== String(row.codeHash)) {
      return null;
    }
    this.db.prepare("DELETE FROM otps WHERE email = ?").run(normalizeEmail(email));
    return this.findStudentByEmail(normalizeEmail(email));
  }

  // -------------------------------------------------------------------------
  // Rooms / mentors / challenge / settings
  // -------------------------------------------------------------------------

  async getRooms() {
    const rows = this.db
      .prepare("SELECT * FROM rooms WHERE active = 1")
      .all() as unknown as Record<string, unknown>[];
    return rows.map(
      (r) =>
        ({
          id: String(r.id),
          name: String(r.name),
          day: String(r.day),
          time: String(r.time),
          durationMin: Number(r.durationMin) || 120,
          zoomLink: r.zoomLink ? String(r.zoomLink) : undefined,
          examFocus: r.examFocus ? String(r.examFocus) : undefined,
          active: true,
        }) satisfies Room
    );
  }

  async getMentorSessions() {
    const today = todayKey();
    const rows = this.db
      .prepare("SELECT * FROM mentors WHERE date >= ? ORDER BY date ASC")
      .all(today) as unknown as Record<string, unknown>[];
    return rows.map((m) => ({
      id: String(m.id),
      mentorName: String(m.mentorName),
      topic: String(m.topic),
      date: String(m.date),
      time: String(m.time),
      zoomLink: m.zoomLink ? String(m.zoomLink) : undefined,
      notes: m.notes ? String(m.notes) : undefined,
      recordingLink: m.recordingLink ? String(m.recordingLink) : undefined,
    })) satisfies MentorSession[];
  }

  async getActiveChallenge() {
    const row = this.db
      .prepare("SELECT * FROM challenges WHERE active = 1 ORDER BY startDate DESC LIMIT 1")
      .get() as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      id: String(row.id),
      name: String(row.name),
      type: row.type as Challenge["type"],
      startDate: String(row.startDate),
      endDate: String(row.endDate),
      rules: String(row.rules),
      active: Boolean(row.active),
    } satisfies Challenge;
  }

  async getSettings() {
    const rows = this.db.prepare("SELECT key, value FROM settings").all() as unknown as {
      key: string;
      value: string;
    }[];
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      announcement: map.announcement || undefined,
      activeChallengeId: map.activeChallengeId || undefined,
      telegramUrl: map.telegramUrl || undefined,
      discordUrl: map.discordUrl || undefined,
    } satisfies PublicSettings;
  }

  // -------------------------------------------------------------------------
  // Study loop
  // -------------------------------------------------------------------------

  async logStudy(studentId: string, input: StudyLogInput) {
    const log: StudyLog = {
      id: nanoid(10),
      studentId,
      date: todayKey(),
      minutes: Math.max(1, Math.round(input.minutes)),
      roomId: input.roomId,
      note: input.note,
      source: input.source ?? "manual",
    };
    this.db
      .prepare("INSERT INTO logs (id,studentId,date,minutes,roomId,note,source) VALUES (?,?,?,?,?,?,?)")
      .run(log.id, log.studentId, log.date, log.minutes, log.roomId ?? null, log.note ?? null, log.source);
    return log;
  }

  async upsertCheckin(studentId: string, input: CheckinInput) {
    const date = todayKey();
    const existing = this.db
      .prepare("SELECT * FROM checkins WHERE studentId = ? AND date = ?")
      .get(studentId, date) as Record<string, unknown> | undefined;
    const completed = Math.max(0, Math.round(input.completedMin));
    const target = input.targetMin ?? (existing ? Number(existing.targetMin) : 300);
    const status: CheckinStatus =
      completed >= target ? "hit" : completed > 0 ? "partial" : "miss";
    const checkin: Checkin = {
      id: existing ? String(existing.id) : nanoid(10),
      studentId,
      date,
      targetMin: target,
      completedMin: completed,
      status,
      note: input.note,
    };
    if (existing) {
      this.db
        .prepare("UPDATE checkins SET targetMin=?, completedMin=?, status=?, note=? WHERE id=?")
        .run(checkin.targetMin, checkin.completedMin, checkin.status, checkin.note ?? null, checkin.id);
    } else {
      this.db
        .prepare("INSERT INTO checkins (id,studentId,date,targetMin,completedMin,status,note) VALUES (?,?,?,?,?,?,?)")
        .run(checkin.id, studentId, date, target, completed, status, checkin.note ?? null);
    }
    return checkin;
  }

  async joinChallenge(studentId: string, challengeId: string) {
    this.db
      .prepare("INSERT OR IGNORE INTO participants (challengeId, studentId, joinedAt) VALUES (?, ?, ?)")
      .run(challengeId, studentId, new Date().toISOString());
  }

  async submitFeedback(studentId: string, input: FeedbackInput) {
    const rec = {
      studentId,
      helpsConsistency: input.helpsConsistency ? 1 : 0,
      sessionsAttended: input.sessionsAttended,
      liked: input.liked ?? "",
      improve: input.improve ?? "",
      joinAgain: input.joinAgain ? 1 : 0,
      wouldPay: input.wouldPay ? 1 : 0,
      features: input.features ?? "",
      submittedAt: new Date().toISOString(),
    };
    this.db
      .prepare(
        `INSERT INTO feedback (studentId,helpsConsistency,sessionsAttended,liked,improve,joinAgain,wouldPay,features,submittedAt)
         VALUES (@studentId,@helpsConsistency,@sessionsAttended,@liked,@improve,@joinAgain,@wouldPay,@features,@submittedAt)`
      )
      .run(rec as unknown as Record<string, never>);
    return rec;
  }

  // -------------------------------------------------------------------------
  // Dashboard
  // -------------------------------------------------------------------------

  async getDashboard(studentId: string): Promise<DashboardMe> {
    const student = await this.getStudent(studentId);
    if (!student) throw new Error("Student not found.");

    const logs = this.db
      .prepare("SELECT * FROM logs WHERE studentId = ?")
      .all(studentId) as unknown as Record<string, unknown>[];
    const checkinsList = this.db
      .prepare("SELECT * FROM checkins WHERE studentId = ?")
      .all(studentId) as unknown as Record<string, unknown>[];

    const today = todayKey();
    const todayMinutes = logs
      .filter((l) => l.date === today)
      .reduce((sum, l) => sum + Number(l.minutes || 0), 0);

    const weekBuckets: DashboardMe["weekBuckets"] = [];
    let weekMinutes = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = localDateKey(d);
      const minutes = logs
        .filter((l) => l.date === k)
        .reduce((sum, l) => sum + Number(l.minutes || 0), 0);
      weekMinutes += minutes;
      weekBuckets.push({
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
        minutes,
      });
    }

    const doneDates = new Set<string>();
    for (const c of checkinsList)
      if (String(c.status) !== "miss") doneDates.add(String(c.date));
    for (const l of logs) if (Number(l.minutes) > 0) doneDates.add(String(l.date));

    let streak = 0;
    for (let i = 0; i < 90; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (doneDates.has(localDateKey(d))) streak++;
      else break;
    }

    const lastCheckin = checkinsList.length
      ? [...checkinsList].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]
      : null;

    const challenge = await this.getActiveChallenge();
    let challengeProgress: DashboardMe["challengeProgress"] = {
      joined: false,
      dayStatuses: [],
    };
    if (challenge) {
      const partner = this.db
        .prepare("SELECT * FROM participants WHERE challengeId = ? AND studentId = ?")
        .get(challenge.id, studentId);
      const joined = Boolean(partner);
      const start = new Date(challenge.startDate + "T00:00:00");
      const dayStatuses: (CheckinStatus | null)[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const k = localDateKey(d);
        if (k > today) {
          dayStatuses.push(null);
          continue;
        }
        const c = checkinsList.find((x) => String(x.date) === k);
        dayStatuses.push(c ? (String(c.status) as CheckinStatus) : "miss");
      }
      challengeProgress = { joined, dayStatuses };
    }

    const lastCheckinToday = lastCheckin?.date === today ? lastCheckin : null;

    return {
      student,
      trial: trialInfo(student.createdAt),
      todayMinutes,
      todayTargetMin:
        lastCheckin?.date === today ? Number(lastCheckin.targetMin) : student.dailyTargetMin,
      weekMinutes,
      weekBuckets,
      streakDays: streak,
      lastCheckin: lastCheckinToday
        ? ({
            id: String(lastCheckinToday.id),
            studentId,
            date: String(lastCheckinToday.date),
            targetMin: Number(lastCheckinToday.targetMin),
            completedMin: Number(lastCheckinToday.completedMin),
            status: String(lastCheckinToday.status) as Checkin["status"],
            note: lastCheckinToday.note ? String(lastCheckinToday.note) : undefined,
          } satisfies Checkin)
        : null,
      rooms: await this.getRooms(),
      activeChallenge: challenge,
      challengeProgress,
      mentorSessions: await this.getMentorSessions(),
      announcement: (await this.getSettings()).announcement,
    };
  }
}

export function openSqliteStore(): SqliteStore | null {
  const file = process.env.SQLITE_DB_PATH;
  if (file) {
    try {
      return new SqliteStore(file);
    } catch {
      return null;
    }
  }
  if (process.env.NODE_ENV === "production") return null;
  try {
    return new SqliteStore(".data/preparea.db");
  } catch {
    return null;
  }
}

// Legacy alias kept for backwards compatibility with any importers.
export const createSqliteStore = openSqliteStore;