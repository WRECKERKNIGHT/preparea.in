import type { Client, Row } from "@libsql/client";
import { nanoid } from "nanoid";
import type {
  Student,
  Room,
  MentorSession,
  Challenge,
  Checkin,
  StudyLog,
  CheckinStatus,
  FeedbackInput,
  DashboardMe,
  CheckinInput,
  StudyLogInput,
  RegisterInput,
  PublicSettings,
} from "@preparea/shared";
import { normalizeEmail, isEmail, minMax } from "@preparea/shared";
import type { Store } from "@/lib/store";
import { buildDashboard } from "@/lib/aggregate";
import { createDb, migrate, resolveDbConfig, type DbConfig } from "@/lib/db";
import { dayKey, todayKey } from "@/lib/dates";
import { verifyPassword } from "@/lib/password";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * The real persistence layer, speaking libSQL/SQLite.
 *
 * Same dialect whether it is pointed at `libsql://` (hosted Turso, used in
 * production) or `file:` (local disk, used in development), so there is one
 * store implementation and one set of queries to reason about.
 */
export class SqlStore implements Store {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  static async open(config: DbConfig = resolveDbConfig()): Promise<SqlStore> {
    if (config.file) mkdirSync(dirname(config.file), { recursive: true });
    const client = createDb(config);
    await migrate(client);
    await seed(client);
    return new SqlStore(client);
  }

  isMock() {
    return false;
  }

  /** Exposed so auth middleware can enforce rate limits against the same DB. */
  get db(): Client {
    return this.client;
  }

  // -------------------------------------------------------------------------
  // Row mapping
  // -------------------------------------------------------------------------

  private static student(r: Row): Student | null {
    const id = String(r.id ?? "");
    const email = String(r.email ?? "");
    const name = String(r.name ?? "");
    if (!id || !email || !name) return null;
    return {
      id,
      name,
      klass: String(r.klass ?? ""),
      exam: String(r.exam ?? ""),
      email,
      passwordHash: r.passwordHash ? String(r.passwordHash) : undefined,
      tgUsername: r.tgUsername ? String(r.tgUsername) : undefined,
      discordUsername: r.discordUsername ? String(r.discordUsername) : undefined,
      dailyTargetMin: Number(r.dailyTargetMin) || 300,
      mainChallenge: r.mainChallenge ? String(r.mainChallenge) : undefined,
      status: (String(r.status) as Student["status"]) || "new",
      createdAt: String(r.createdAt ?? ""),
      tokenVersion: Number(r.tokenVersion) || 0,
    };
  }

  private static room(r: Row): Room {
    return {
      id: String(r.id),
      name: String(r.name),
      day: String(r.day),
      time: String(r.time),
      durationMin: Number(r.durationMin) || 120,
      zoomLink: r.zoomLink ? String(r.zoomLink) : undefined,
      examFocus: r.examFocus ? String(r.examFocus) : undefined,
      active: Boolean(r.active),
    };
  }

  private static mentor(r: Row): MentorSession {
    return {
      id: String(r.id),
      mentorName: String(r.mentorName),
      topic: String(r.topic),
      date: String(r.date),
      time: String(r.time),
      zoomLink: r.zoomLink ? String(r.zoomLink) : undefined,
      notes: r.notes ? String(r.notes) : undefined,
      recordingLink: r.recordingLink ? String(r.recordingLink) : undefined,
    };
  }

  private static challenge(r: Row): Challenge {
    return {
      id: String(r.id),
      name: String(r.name),
      type: String(r.type) as Challenge["type"],
      startDate: String(r.startDate),
      endDate: String(r.endDate),
      rules: String(r.rules),
      active: Boolean(r.active),
    };
  }

  private static log(r: Row): StudyLog {
    return {
      id: String(r.id),
      studentId: String(r.studentId),
      date: String(r.date),
      minutes: Number(r.minutes) || 0,
      roomId: r.roomId ? String(r.roomId) : undefined,
      note: r.note ? String(r.note) : undefined,
      source: r.source === "timer" ? "timer" : "manual",
    };
  }

  private static checkin(r: Row): Checkin {
    return {
      id: String(r.id),
      studentId: String(r.studentId),
      date: String(r.date),
      targetMin: Number(r.targetMin) || 300,
      completedMin: Number(r.completedMin) || 0,
      status: String(r.status) as CheckinStatus,
      note: r.note ? String(r.note) : undefined,
    };
  }

  // -------------------------------------------------------------------------
  // Students
  // -------------------------------------------------------------------------

  async findStudentByEmail(email: string) {
    const rs = await this.client.execute({
      sql: "SELECT * FROM students WHERE email = ?",
      args: [normalizeEmail(email)],
    });
    return rs.rows.length ? SqlStore.student(rs.rows[0]) : null;
  }

  async getStudent(id: string) {
    const rs = await this.client.execute({
      sql: "SELECT * FROM students WHERE id = ?",
      args: [id],
    });
    return rs.rows.length ? SqlStore.student(rs.rows[0]) : null;
  }

  async registerStudent(input: RegisterInput) {
    if (!input.name.trim()) throw new Error("Name is required.");
    if (!isEmail(input.email)) throw new Error("Valid email is required.");
    if (!input.klass || !input.exam) throw new Error("Class and exam are required.");
    if (!minMax(input.dailyTargetMin, 15, 720))
      throw new Error("Daily target must be 15-720 minutes.");
    if (await this.findStudentByEmail(input.email))
      throw new Error("This email is already registered.");

    const student: Student = {
      id: nanoid(10),
      name: input.name.trim().slice(0, 80),
      klass: input.klass,
      exam: input.exam,
      email: normalizeEmail(input.email),
      passwordHash: input.passwordHash,
      tgUsername: input.tgUsername?.trim() || undefined,
      discordUsername: input.discordUsername?.trim() || undefined,
      dailyTargetMin: Math.round(input.dailyTargetMin),
      mainChallenge: input.mainChallenge || undefined,
      status: "new",
      createdAt: new Date().toISOString(),
      tokenVersion: 0,
    };

    await this.client.execute({
      sql: `INSERT INTO students
              (id, name, klass, exam, email, passwordHash, tgUsername, discordUsername,
               dailyTargetMin, mainChallenge, status, createdAt, tokenVersion, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      args: [
        student.id,
        student.name,
        student.klass,
        student.exam,
        student.email,
        student.passwordHash ?? null,
        student.tgUsername ?? null,
        student.discordUsername ?? null,
        student.dailyTargetMin,
        student.mainChallenge ?? null,
        student.status,
        student.createdAt,
        student.createdAt,
      ],
    });
    return student;
  }

  async login(email: string, password: string): Promise<Student | null> {
    const student = await this.findStudentByEmail(email);
    if (!student || !student.passwordHash) return null;

    // Verify password using scrypt
    const isValid = await verifyPassword(password, student.passwordHash);
    return isValid ? student : null;
  }

  private static readonly PATCHABLE = new Set([
    "name",
    "klass",
    "exam",
    "tgUsername",
    "discordUsername",
    "dailyTargetMin",
    "mainChallenge",
    "status",
    // Password reset updates the hash through this same path.
    "passwordHash",
    "tokenVersion",
  ]);

  async updateStudent(id: string, patch: Partial<Student>) {
    const keys = Object.keys(patch).filter((k) => SqlStore.PATCHABLE.has(k));
    if (keys.length === 0) return this.getStudent(id);

    const assignments = keys.map((k) => `${k} = ?`).join(", ");
    const args: (string | number | null)[] = keys.map((k) => {
      const v = (patch as Record<string, unknown>)[k];
      return v === undefined || v === null ? null : (v as string | number);
    });
    args.push(new Date().toISOString(), id);

    await this.client.execute({
      sql: `UPDATE students SET ${assignments}, updatedAt = ? WHERE id = ?`,
      args,
    });
    return this.getStudent(id);
  }

  /** Invalidates every issued token by bumping the student's token version. */
  async revokeSessions(studentId: string) {
    await this.client.execute({
      sql: "UPDATE students SET tokenVersion = tokenVersion + 1 WHERE id = ?",
      args: [studentId],
    });
    await this.client.execute({
      sql: "UPDATE sessions SET revokedAt = ? WHERE studentId = ? AND revokedAt IS NULL",
      args: [new Date().toISOString(), studentId],
    });
  }

  async getTokenVersion(studentId: string): Promise<number> {
    const rs = await this.client.execute({
      sql: "SELECT tokenVersion FROM students WHERE id = ?",
      args: [studentId],
    });
    return rs.rows.length ? Number(rs.rows[0].tokenVersion) || 0 : -1;
  }

  // -------------------------------------------------------------------------
  // Rooms / mentors / challenges / settings
  // -------------------------------------------------------------------------

  async getRooms() {
    const rs = await this.client.execute("SELECT * FROM rooms WHERE active = 1 ORDER BY time ASC");
    return rs.rows.map(SqlStore.room);
  }

  async getMentorSessions() {
    const rs = await this.client.execute({
      sql: "SELECT * FROM mentors WHERE date >= ? ORDER BY date ASC, time ASC",
      args: [todayKey()],
    });
    return rs.rows.map(SqlStore.mentor);
  }

  async listMentorSessions({ includePast = false } = {}) {
    const rs = includePast
      ? await this.client.execute("SELECT * FROM mentors ORDER BY date ASC, time ASC")
      : await this.client.execute({
          sql: "SELECT * FROM mentors WHERE date >= ? ORDER BY date ASC, time ASC",
          args: [todayKey()],
        });
    return rs.rows.map(SqlStore.mentor);
  }

  async getActiveChallenge() {
    const rs = await this.client.execute(
      "SELECT * FROM challenges WHERE active = 1 ORDER BY startDate DESC LIMIT 1"
    );
    return rs.rows.length ? SqlStore.challenge(rs.rows[0]) : null;
  }

  async getChallenge(id: string) {
    const rs = await this.client.execute({
      sql: "SELECT * FROM challenges WHERE id = ?",
      args: [id],
    });
    return rs.rows.length ? SqlStore.challenge(rs.rows[0]) : null;
  }

  async listChallenges() {
    const rs = await this.client.execute(
      "SELECT * FROM challenges ORDER BY active DESC, startDate DESC"
    );
    return rs.rows.map(SqlStore.challenge);
  }

  async isParticipant(challengeId: string, studentId: string) {
    const rs = await this.client.execute({
      sql: "SELECT 1 AS x FROM participants WHERE challengeId = ? AND studentId = ?",
      args: [challengeId, studentId],
    });
    return rs.rows.length > 0;
  }

  async countParticipants(challengeId: string) {
    const rs = await this.client.execute({
      sql: "SELECT COUNT(*) AS n FROM participants WHERE challengeId = ?",
      args: [challengeId],
    });
    return Number(rs.rows[0]?.n ?? 0);
  }

  async getSettings() {
    const rs = await this.client.execute("SELECT key, value FROM settings");
    const map = Object.fromEntries(rs.rows.map((r) => [String(r.key), String(r.value)]));
    const settings: PublicSettings = {
      announcement: map.announcement || undefined,
      activeChallengeId: map.activeChallengeId || undefined,
      telegramUrl: map.telegramUrl || undefined,
      discordUrl: map.discordUrl || undefined,
    };
    return settings;
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
    await this.client.execute({
      sql: "INSERT INTO logs (id, studentId, date, minutes, roomId, note, source) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        log.id,
        log.studentId,
        log.date,
        log.minutes,
        log.roomId ?? null,
        log.note ?? null,
        log.source,
      ],
    });
    return log;
  }

  async listStudyLogs(studentId: string, limit = 60) {
    const rs = await this.client.execute({
      sql: "SELECT * FROM logs WHERE studentId = ? ORDER BY date DESC, id DESC LIMIT ?",
      args: [studentId, Math.min(Math.max(1, limit), 500)],
    });
    return rs.rows.map(SqlStore.log);
  }

  async upsertCheckin(studentId: string, input: CheckinInput) {
    const date = todayKey();
    const existing = await this.client.execute({
      sql: "SELECT * FROM checkins WHERE studentId = ? AND date = ?",
      args: [studentId, date],
    });

    const target = input.targetMin ?? (existing.rows.length ? Number(existing.rows[0].targetMin) : 300);
    const completed = Math.max(0, Math.round(input.completedMin));
    const status: CheckinStatus = completed >= target ? "hit" : completed > 0 ? "partial" : "miss";

    await this.client.execute({
      sql: `INSERT INTO checkins (id, studentId, date, targetMin, completedMin, status, note)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(studentId, date) DO UPDATE SET
              targetMin = excluded.targetMin,
              completedMin = excluded.completedMin,
              status = excluded.status,
              note = excluded.note`,
      args: [nanoid(10), studentId, date, target, completed, status, input.note ?? null],
    });

    return {
      id: existing.rows.length ? String(existing.rows[0].id) : "current",
      studentId,
      date,
      targetMin: target,
      completedMin: completed,
      status,
      note: input.note,
    } satisfies Checkin;
  }

  async joinChallenge(studentId: string, challengeId: string) {
    await this.client.execute({
      sql: `INSERT INTO participants (challengeId, studentId, joinedAt) VALUES (?, ?, ?)
            ON CONFLICT(challengeId, studentId) DO NOTHING`,
      args: [challengeId, studentId, new Date().toISOString()],
    });
  }

  async submitFeedback(studentId: string, input: FeedbackInput) {
    const rec = {
      id: nanoid(10),
      studentId,
      helpsConsistency: input.helpsConsistency,
      sessionsAttended: Math.max(0, Math.round(input.sessionsAttended)),
      liked: input.liked ?? "",
      improve: input.improve ?? "",
      joinAgain: input.joinAgain,
      wouldPay: input.wouldPay,
      features: input.features ?? "",
      submittedAt: new Date().toISOString(),
    };
    await this.client.execute({
      sql: `INSERT INTO feedback
              (id, studentId, helpsConsistency, sessionsAttended, liked, improve,
               joinAgain, wouldPay, features, submittedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(studentId) DO UPDATE SET
              helpsConsistency = excluded.helpsConsistency,
              sessionsAttended = excluded.sessionsAttended,
              liked = excluded.liked,
              improve = excluded.improve,
              joinAgain = excluded.joinAgain,
              wouldPay = excluded.wouldPay,
              features = excluded.features,
              submittedAt = excluded.submittedAt`,
      args: [
        rec.id,
        rec.studentId,
        rec.helpsConsistency ? 1 : 0,
        rec.sessionsAttended,
        rec.liked,
        rec.improve,
        rec.joinAgain ? 1 : 0,
        rec.wouldPay ? 1 : 0,
        rec.features,
        rec.submittedAt,
      ],
    });
    return rec;
  }

  async getFeedback(studentId: string) {
    const rs = await this.client.execute({
      sql: "SELECT * FROM feedback WHERE studentId = ?",
      args: [studentId],
    });
    return rs.rows.length ? rs.rows[0] : null;
  }

  // -------------------------------------------------------------------------
  // Dashboard + leaderboard
  // -------------------------------------------------------------------------

  async getDashboard(studentId: string): Promise<DashboardMe> {
    const student = await this.getStudent(studentId);
    if (!student) throw new Error("Student not found.");

    const [logRows, checkinRows, challenge] = await Promise.all([
      this.client.execute({ sql: "SELECT * FROM logs WHERE studentId = ?", args: [studentId] }),
      this.client.execute({ sql: "SELECT * FROM checkins WHERE studentId = ?", args: [studentId] }),
      this.getActiveChallenge(),
    ]);

    const joined = challenge ? await this.isParticipant(challenge.id, studentId) : false;

    return buildDashboard({
      student,
      logs: logRows.rows.map(SqlStore.log),
      checkins: checkinRows.rows.map(SqlStore.checkin),
      rooms: await this.getRooms(),
      challenge,
      joined,
      mentorSessions: await this.getMentorSessions(),
      announcement: (await this.getSettings()).announcement,
    });
  }

  async getStudyTotals(studentId: string, sinceKey: string) {
    const rs = await this.client.execute({
      sql: `SELECT
              COALESCE(SUM(CASE WHEN date >= ? THEN minutes ELSE 0 END), 0) AS windowMinutes,
              COALESCE(SUM(minutes), 0) AS totalMinutes,
              COUNT(*) AS totalSessions
            FROM logs WHERE studentId = ?`,
      args: [sinceKey, studentId],
    });
    const row = rs.rows[0];
    return {
      windowMinutes: Number(row?.windowMinutes ?? 0),
      totalMinutes: Number(row?.totalMinutes ?? 0),
      totalSessions: Number(row?.totalSessions ?? 0),
    };
  }

  /**
   * Minutes + check-in hits per student inside the window, plus the students'
   * names so the leaderboard never leaks email addresses.
   */
  async getLeaderboardRows(sinceKey: string) {
    const rs = await this.client.execute({
      sql: `SELECT
              s.id AS studentId,
              s.name,
              s.klass,
              s.exam,
              COALESCE(SUM(l.minutes), 0) AS minutes,
              COALESCE(SUM(CASE WHEN c.status IN ('hit','partial') THEN 1 ELSE 0 END), 0) AS checkinsHit
            FROM students s
            LEFT JOIN logs l ON l.studentId = s.id AND l.date >= ?
            LEFT JOIN checkins c ON c.studentId = s.id AND c.date >= ?
            WHERE s.status IN ('new','active','member','mentor')
            GROUP BY s.id
            ORDER BY minutes DESC, s.name ASC`,
      args: [sinceKey, sinceKey],
    });
    return rs.rows.map((r) => ({
      studentId: String(r.studentId),
      name: String(r.name),
      klass: String(r.klass ?? ""),
      exam: String(r.exam ?? ""),
      minutes: Number(r.minutes) || 0,
      checkinsHit: Number(r.checkinsHit) || 0,
    }));
  }
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

const DEMO_STUDENTS = [
  { id: "demo-1", name: "Demo Aspirant", klass: "12", exam: "JEE", email: "demo@preparea.in", tg: "@demoaspirant", target: 300, challenge: "Procrastination", status: "active", created: -12 },
  { id: "member-2", name: "Ananya S.", klass: "11", exam: "NEET", email: "ananya@example.com", target: 240, status: "active", created: -5 },
  { id: "member-3", name: "Arjun K.", klass: "12", exam: "JEE", email: "arjun@example.com", target: 360, status: "active", created: -4 },
  { id: "member-4", name: "Pooja M.", klass: "Dropper", exam: "NEET", email: "pooja@example.com", target: 420, status: "member", created: -3 },
];

const SEED_ROOMS = [
  { id: "room-morning", name: "Morning Focus", day: "6:00 – 8:00 AM", time: "06:00", durationMin: 120, examFocus: "All exams" },
  { id: "room-afternoon", name: "Afternoon Focus", day: "1:00 – 3:00 PM", time: "13:00", durationMin: 120, examFocus: "All exams" },
  { id: "room-evening", name: "Evening Focus", day: "6:00 – 9:00 PM", time: "18:00", durationMin: 180, examFocus: "All exams" },
  { id: "room-night", name: "Night Focus", day: "10:00 PM – 12:00 AM", time: "22:00", durationMin: 120, examFocus: "All exams" },
];

const SEED_MENTORS = [
  { id: "mentor-1", mentorName: "Rohit (NIT Trichy)", topic: "How I planned my JEE preparation", offset: 2, time: "7:00 PM", notes: "30 minutes talk + Q&A" },
  { id: "mentor-2", mentorName: "Shreya (AIIMS)", topic: "Revision strategy that actually sticks", offset: 5, time: "7:00 PM", notes: "45 minutes including Q&A" },
  { id: "mentor-3", mentorName: "Karan (IIIT Hyderabad)", topic: "Staying consistent for 7 months", offset: 8, time: "7:00 PM", notes: "Open conversation" },
];

const SEED_HISTORY: ReadonlyArray<readonly [daysAgo: number, minutes: number, status: CheckinStatus]> = [
  [6, 210, "hit"],
  [5, 300, "hit"],
  [4, 180, "partial"],
  [3, 330, "hit"],
  [2, 270, "hit"],
  [1, 240, "partial"],
];

/**
 * Populates a brand-new database with the demo cohort so a fresh clone has a
 * working dashboard immediately. Guarded by a row count, so it never touches
 * real data.
 */
async function seed(client: Client): Promise<void> {
  const { rows } = await client.execute("SELECT COUNT(*) AS n FROM students");
  if (Number(rows[0]?.n ?? 0) > 0) return;

  const now = new Date();

  for (const s of DEMO_STUDENTS) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO students
              (id, name, klass, exam, email, tgUsername, discordUsername,
               dailyTargetMin, mainChallenge, status, createdAt, tokenVersion)
            VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, 0)`,
      args: [
        s.id,
        s.name,
        s.klass,
        s.exam,
        s.email,
        s.tg ?? null,
        s.target,
        s.challenge ?? null,
        s.status,
        new Date(now.getTime() + s.created * 86400000).toISOString(),
      ],
    });
  }

  for (const r of SEED_ROOMS) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO rooms (id, name, day, time, durationMin, zoomLink, examFocus, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      args: [
        r.id,
        r.name,
        r.day,
        r.time,
        r.durationMin,
        `https://zoom.us/j/preparea-${r.id.replace("room-", "")}`,
        r.examFocus,
      ],
    });
  }

  for (const m of SEED_MENTORS) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO mentors (id, mentorName, topic, date, time, zoomLink, notes, recordingLink)
            VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
      args: [m.id, m.mentorName, m.topic, dayKey(m.offset, now), m.time, null, m.notes],
    });
  }

  await client.execute({
    sql: `INSERT OR IGNORE INTO challenges (id, name, type, startDate, endDate, rules, active)
          VALUES (?, ?, ?, ?, ?, ?, 1)`,
    args: [
      "challenge-7day",
      "7-Day Study Consistency Challenge",
      "7day",
      dayKey(-3, now),
      dayKey(3, now),
      "Set a target each morning. Study. Check in each evening. Missed a day? Tomorrow counts.\n\nKeep it personal — no comparing hours with others.",
    ],
  });

  for (const studentId of ["demo-1", "member-2", "member-3"]) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO participants (challengeId, studentId, joinedAt)
            VALUES ('challenge-7day', ?, ?)`,
      args: [studentId, dayKey(-3, now)],
    });
  }

  for (const [daysAgo, minutes, status] of SEED_HISTORY) {
    const date = dayKey(-daysAgo, now);
    await client.execute({
      sql: "INSERT OR IGNORE INTO logs (id, studentId, date, minutes, roomId, note, source) VALUES (?, 'demo-1', ?, ?, NULL, NULL, 'timer')",
      args: [nanoid(10), date, minutes],
    });
    await client.execute({
      sql: "INSERT OR IGNORE INTO checkins (id, studentId, date, targetMin, completedMin, status, note) VALUES (?, 'demo-1', ?, 300, ?, ?, NULL)",
      args: [nanoid(10), date, minutes, status],
    });
  }

  const settings: PublicSettings = {
    announcement: "7-Day Challenge cohort is live. Evening check-ins before 11 PM, please.",
    activeChallengeId: "challenge-7day",
    telegramUrl: "https://t.me/preparea_announcements",
    discordUrl: "https://discord.gg/preparea",
  };
  for (const [key, value] of Object.entries(settings)) {
    if (!value) continue;
    await client.execute({
      sql: "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
      args: [key, value],
    });
  }
}

export async function openSqlStore(config?: DbConfig): Promise<SqlStore | null> {
  try {
    return await SqlStore.open(config);
  } catch (e) {
    console.error("[preparea-store] could not open the SQL store:", e);
    return null;
  }
}
