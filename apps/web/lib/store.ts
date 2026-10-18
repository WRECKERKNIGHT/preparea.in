import { createHash } from "node:crypto";
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
} from "@preparea/shared";
import { normalizeEmail, isEmail, minMax } from "@preparea/shared";
import { getSheetsAdmin } from "@/lib/sheets";
import { openSqlStore } from "@/lib/sql-store";
import { buildDashboard } from "@/lib/aggregate";
import { dayKey, todayKey } from "@/lib/dates";
import { verifyPassword } from "./password";

function hash(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

// ---------------------------------------------------------------------------
// Mock store (in-memory, deterministic seed) — runs with zero configuration.
// ---------------------------------------------------------------------------

class MockStore {
  students: Student[] = [];
  logs: StudyLog[] = [];
  checkins: Checkin[] = [];
  rooms: Room[];
  mentors: MentorSession[];
  challenge: Challenge;
  participants: ChallengeParticipant[] = [];
  otps = new Map<string, { code: string; purpose: string; expiresAt: number }>();
  settings: PublicSettings;

  constructor() {
    const demoId = "demo-1";
    this.students.push({
      id: demoId,
      name: "Demo Aspirant",
      klass: "12",
      exam: "JEE",
      email: "demo@preparea.in",
      tgUsername: "@demoaspirant",
      dailyTargetMin: 300,
      mainChallenge: "Procrastination",
      status: "active",
      createdAt: dayKey(-12),
    });
    this.students.push({
      id: "member-2",
      name: "Ananya S.",
      klass: "11",
      exam: "NEET",
      email: "ananya@example.com",
      dailyTargetMin: 240,
      status: "active",
      createdAt: dayKey(-5),
    });
    this.students.push({
      id: "member-3",
      name: "Arjun K.",
      klass: "12",
      exam: "JEE",
      email: "arjun@example.com",
      dailyTargetMin: 360,
      status: "active",
      createdAt: dayKey(-4),
    });
    this.students.push({
      id: "member-4",
      name: "Pooja M.",
      klass: "Dropper",
      exam: "NEET",
      email: "pooja@example.com",
      dailyTargetMin: 420,
      status: "member",
      createdAt: dayKey(-3),
    });

    this.rooms = [
      {
        id: "room-morning",
        name: "Morning Focus",
        day: "6:00 – 8:00 AM",
        time: "06:00",
        durationMin: 120,
        zoomLink: "https://zoom.us/j/preparea-morning",
        examFocus: "All exams",
        active: true,
      },
      {
        id: "room-afternoon",
        name: "Afternoon Focus",
        day: "1:00 – 3:00 PM",
        time: "13:00",
        durationMin: 120,
        zoomLink: "https://zoom.us/j/preparea-afternoon",
        examFocus: "All exams",
        active: true,
      },
      {
        id: "room-evening",
        name: "Evening Focus",
        day: "6:00 – 9:00 PM",
        time: "18:00",
        durationMin: 180,
        zoomLink: "https://zoom.us/j/preparea-evening",
        examFocus: "All exams",
        active: true,
      },
      {
        id: "room-night",
        name: "Night Focus",
        day: "10:00 PM – 12:00 AM",
        time: "22:00",
        durationMin: 120,
        zoomLink: "https://zoom.us/j/preparea-night",
        examFocus: "All exams",
        active: true,
      },
    ];

    this.mentors = [
      {
        id: "mentor-1",
        mentorName: "Rohit (NIT Trichy)",
        topic: "How I planned my JEE preparation",
        date: dayKey(2),
        time: "7:00 PM",
        notes: "30 minutes talk + Q&A",
      },
      {
        id: "mentor-2",
        mentorName: "Shreya (AIIMS)",
        topic: "Revision strategy that actually sticks",
        date: dayKey(5),
        time: "7:00 PM",
        notes: "45 minutes including Q&A",
      },
      {
        id: "mentor-3",
        mentorName: "Karan (IIIT Hyderabad)",
        topic: "Staying consistent for 7 months",
        date: dayKey(8),
        time: "7:00 PM",
        notes: "Open conversation",
      },
    ];

    this.challenge = {
      id: "challenge-7day",
      name: "7-Day Study Consistency Challenge",
      type: "7day",
      startDate: dayKey(-3),
      endDate: dayKey(3),
      rules:
        "Set a target each morning. Study. Check in each evening. Missed a day? Tomorrow counts.\n\nKeep it personal — no comparing hours with others.",
      active: true,
    };

    this.participants.push({
      challengeId: this.challenge.id,
      studentId: demoId,
      joinedAt: dayKey(-3),
    });
    this.participants.push({
      challengeId: this.challenge.id,
      studentId: "member-2",
      joinedAt: dayKey(-3),
    });
    this.participants.push({
      challengeId: this.challenge.id,
      studentId: "member-3",
      joinedAt: dayKey(-2),
    });

    // Seed logs + checkins so demo stats look real.
    const seed = [
      [6, 210, "hit"],
      [5, 300, "hit"],
      [4, 180, "partial"],
      [3, 330, "hit"],
      [2, 270, "hit"],
      [1, 240, "partial"],
    ] as const;
    for (const [offset, minutes, status] of seed) {
      const k = dayKey(-offset);
      this.logs.push({
        id: nanoid(8),
        studentId: demoId,
        date: k,
        minutes,
        source: "timer",
      });
      this.checkins.push({
        id: nanoid(8),
        studentId: demoId,
        date: k,
        targetMin: 300,
        completedMin: minutes,
        status: status,
      });
    }

    this.settings = {
      announcement:
        "7-Day Challenge cohort is live. Evening check-ins before 11 PM, please.",
      activeChallengeId: this.challenge.id,
      telegramUrl: "https://t.me/preparea_announcements",
      discordUrl: "https://discord.gg/preparea",
    };
  }

  isMock() {
    return true;
  }

  async findStudentByEmail(email: string) {
    const norm = normalizeEmail(email);
    return this.students.find((s) => s.email === norm) ?? null;
  }

  async getStudent(id: string) {
    return this.students.find((s) => s.id === id) ?? null;
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
      passwordHash: input.passwordHash,
      tgUsername: input.tgUsername?.trim() || undefined,
      discordUsername: input.discordUsername?.trim() || undefined,
      dailyTargetMin: input.dailyTargetMin,
      mainChallenge: input.mainChallenge || undefined,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    this.students.push(student);
    return student;
  }

  async updateStudent(id: string, patch: Partial<Student>) {
    const s = this.getStudent(id);
    if (!s) return null;
    Object.assign(s, patch);
    return s;
  }

  async login(email: string, password: string): Promise<Student | null> {
    const student = await this.findStudentByEmail(email);
    if (!student || !student.passwordHash) return null;
    const isValid = await verifyPassword(password, student.passwordHash);
    return isValid ? student : null;
  }

  async verifyDemo() {
    return this.students[0];
  }

  async getRooms() {
    return this.rooms;
  }

  async getMentorSessions() {
    return this.mentors;
  }

  async getActiveChallenge() {
    return this.challenge;
  }

  async getChallenge(id: string) {
    return this.challenge.id === id ? this.challenge : null;
  }

  async listChallenges() {
    return [this.challenge];
  }

  async isParticipant(challengeId: string, studentId: string) {
    return this.participants.some(
      (p) => p.challengeId === challengeId && p.studentId === studentId
    );
  }

  async countParticipants(challengeId: string) {
    return this.participants.filter((p) => p.challengeId === challengeId).length;
  }

  async listStudyLogs(studentId: string, limit = 60) {
    return this.logs
      .filter((l) => l.studentId === studentId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
  }

  async listMentorSessions({ includePast = false } = {}) {
    if (includePast) return this.mentors;
    return this.mentors.filter((m) => m.date >= todayKey());
  }

  async getStudyTotals(studentId: string, sinceKey: string) {
    const mine = this.logs.filter((l) => l.studentId === studentId);
    return {
      windowMinutes: mine
        .filter((l) => l.date >= sinceKey)
        .reduce((sum, l) => sum + l.minutes, 0),
      totalMinutes: mine.reduce((sum, l) => sum + l.minutes, 0),
      totalSessions: mine.length,
    };
  }

  async getLeaderboardRows(sinceKey: string) {
    return this.students.map((s) => ({
      studentId: s.id,
      name: s.name,
      klass: s.klass,
      exam: s.exam,
      minutes: this.logs
        .filter((l) => l.studentId === s.id && l.date >= sinceKey)
        .reduce((sum, l) => sum + l.minutes, 0),
      checkinsHit: this.checkins.filter(
        (c) => c.studentId === s.id && c.date >= sinceKey && c.status !== "miss"
      ).length,
    }));
  }

  async revokeSessions() {}

  async getTokenVersion() {
    return 0;
  }

  async getSettings() {
    return this.settings;
  }

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
    this.logs.push(log);
    return log;
  }

  async upsertCheckin(studentId: string, input: CheckinInput) {
    const date = todayKey();
    const existing = this.checkins.find(
      (c) => c.studentId === studentId && c.date === date
    );
    const completed = Math.max(0, Math.round(input.completedMin));
    const target = input.targetMin ?? existing?.targetMin ?? 300;
    const status =
      completed >= target ? "hit" : completed > 0 ? "partial" : "miss";
    const checkin: Checkin = {
      id: existing?.id ?? nanoid(10),
      studentId,
      date,
      targetMin: target,
      completedMin: completed,
      status,
      note: input.note,
    };
    if (existing) {
      Object.assign(existing, checkin);
      return existing;
    }
    this.checkins.push(checkin);
    return checkin;
  }

  async joinChallenge(studentId: string, challengeId: string) {
    const exists = this.participants.some(
      (p) =>
        p.challengeId === challengeId && p.studentId === studentId
    );
    if (!exists) {
      this.participants.push({
        challengeId,
        studentId,
        joinedAt: new Date().toISOString(),
      });
    }
  }

  async submitFeedback(studentId: string, input: FeedbackInput) {
    return {
      studentId,
      ...input,
      submittedAt: new Date().toISOString(),
    };
  }

  async getDashboard(studentId: string): Promise<DashboardMe> {
    const student = await this.getStudent(studentId);
    if (!student) throw new Error("Student not found.");

    const challenge = this.challenge;

    return buildDashboard({
      student,
      logs: this.logs.filter((l) => l.studentId === studentId),
      checkins: this.checkins.filter((c) => c.studentId === studentId),
      rooms: this.rooms,
      challenge,
      joined: this.participants.some(
        (p) => p.challengeId === challenge.id && p.studentId === studentId
      ),
      mentorSessions: this.mentors,
      announcement: this.settings.announcement,
    });
  }
}

// ---------------------------------------------------------------------------
// Store façade
// ---------------------------------------------------------------------------

export interface StudyTotals {
  windowMinutes: number;
  totalMinutes: number;
  totalSessions: number;
}

export interface LeaderboardRow {
  studentId: string;
  name: string;
  klass: string;
  exam: string;
  minutes: number;
  checkinsHit: number;
}

/**
 * Every method is async, including the in-memory mock's. The old
 * `T | Promise<T>` return types forced `await (await x).y` gymnastics at every
 * call site and made typos legal; one uniform shape is easier to hold.
 */
export interface Store {
  isMock(): boolean;

  findStudentByEmail(email: string): Promise<Student | null>;
  getStudent(id: string): Promise<Student | null>;
  registerStudent(input: RegisterInput): Promise<Student>;
  updateStudent(id: string, patch: Partial<Student>): Promise<Student | null>;
  revokeSessions(studentId: string): Promise<void>;
  getTokenVersion(studentId: string): Promise<number>;

  login(email: string, password: string): Promise<Student | null>;

  getRooms(): Promise<Room[]>;
  getMentorSessions(): Promise<MentorSession[]>;
  listMentorSessions(opts?: { includePast?: boolean }): Promise<MentorSession[]>;

  getActiveChallenge(): Promise<Challenge | null>;
  getChallenge(id: string): Promise<Challenge | null>;
  listChallenges(): Promise<Challenge[]>;
  isParticipant(challengeId: string, studentId: string): Promise<boolean>;
  countParticipants(challengeId: string): Promise<number>;

  getSettings(): Promise<PublicSettings>;
  getDashboard(studentId: string): Promise<DashboardMe>;

  logStudy(studentId: string, input: StudyLogInput): Promise<StudyLog>;
  listStudyLogs(studentId: string, limit?: number): Promise<StudyLog[]>;
  upsertCheckin(studentId: string, input: CheckinInput): Promise<Checkin>;
  getStudyTotals(studentId: string, sinceKey: string): Promise<StudyTotals>;
  getLeaderboardRows(sinceKey: string): Promise<LeaderboardRow[]>;

  joinChallenge(studentId: string, challengeId: string): Promise<void>;
  submitFeedback(studentId: string, input: FeedbackInput): Promise<unknown>;
}

const mock = new MockStore();

/**
 * Resolves the persistence backend.
 *
 * Preference order:
 *   1. Google Sheets  — only when GOOGLE_SPREADSHEET_ID is set (legacy opt-in)
 *   2. libSQL/SQLite   — hosted Turso in production, local file in dev
 *   3. In-memory mock  — last-resort so the app still renders on a misconfigured deploy
 *
 * Async because opening the SQL store runs migrations and the seed guard.
 * Results are memoised in `lib/store-instance.ts`.
 */
export async function getStore(): Promise<Store> {
  const admin = getSheetsAdmin();
  if (admin) return new SheetsStore(admin);
  const sql = await openSqlStore();
  if (sql) return sql;
  return mock;
}

// ---------------------------------------------------------------------------
// Google Sheets backend
// ---------------------------------------------------------------------------

class SheetsStore implements Store {
  private admin: import("@/lib/sheets").SheetsAdmin;
  private ship = {
    students: ["id", "name", "klass", "exam", "email", "passwordHash", "tgUsername", "discordUsername", "dailyTargetMin", "mainChallenge", "status", "createdAt"],
    logs: ["id", "studentId", "date", "minutes", "roomId", "note", "source"],
    checkins: ["id", "studentId", "date", "targetMin", "completedMin", "status", "note"],
    rooms: ["id", "name", "day", "time", "durationMin", "zoomLink", "examFocus", "active"],
    mentors: ["id", "mentorName", "topic", "date", "time", "zoomLink", "notes", "recordingLink"],
    challenges: ["id", "name", "type", "startDate", "endDate", "rules", "active"],
    participants: ["challengeId", "studentId", "joinedAt"],
    feedback: ["studentId", "helpsConsistency", "sessionsAttended", "liked", "improve", "joinAgain", "wouldPay", "wouldPay", "features", "submittedAt"],
    settings: ["key", "value"],
  } as const;

  private dev: boolean = process.env.NODE_ENV !== "production";

  constructor(admin: import("@/lib/sheets").SheetsAdmin) {
    this.admin = admin;
  }

  isMock() {
    return false;
  }

  private async tab<T extends keyof SheetsStore["ship"]>(
    name: T
  ): Promise<Record<string, string>[]> {
    const headers = this.ship[name];
    const rows = await this.admin.readRows(name as string);
    if (rows.length === 0) return [];
    return rows.slice(1).map((row) => {
      const rec: Record<string, string> = {};
      headers.forEach((h, i) => {
        rec[h] = row.values[i] ?? "";
      });
      return rec;
    });
  }

  private async append(name: string, rec: Record<string, string>) {
    const headers = this.ship[name as keyof SheetsStore["ship"]];
    await this.admin.appendRows(name, [headers.map((h) => rec[h] ?? "")]);
  }

  async findStudentByEmail(email: string) {
    const norm = normalizeEmail(email);
    const rows = await this.tab("students");
    const row = rows.find((r) => r.email?.toLowerCase() === norm);
    return row ? (this.toStudent(row) ?? null) : null;
  }

  private toStudent(r: Record<string, string>): Student | null {
    if (!r.id || !r.name || !r.email) return null;
    return {
      id: r.id,
      name: r.name,
      klass: r.klass,
      exam: r.exam,
      email: r.email,
      passwordHash: r.passwordHash || undefined,
      tgUsername: r.tgUsername || undefined,
      discordUsername: r.discordUsername || undefined,
      dailyTargetMin: Number(r.dailyTargetMin) || 300,
      mainChallenge: r.mainChallenge || undefined,
      status: (r.status as Student["status"]) || "new",
      createdAt: r.createdAt || "",
    };
  }

  async getStudent(id: string) {
    const rows = await this.tab("students");
    const row = rows.find((r) => r.id === id);
    return row ? this.toStudent(row) : null;
  }

  async updateStudent(id: string, patch: Partial<Student>) {
    const admin = this.admin;
    const rows = await this.tab("students");
    const headers = this.ship.students;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return null;
    const merged = { ...rows[idx], ...patch };
    const headersList: readonly string[] = headers;
    for (const key of Object.keys(patch) as (keyof typeof patch)[]) {
      const col = headersList.indexOf(key as string);
      if (col < 0) continue;
      await admin.updateCell(
        "students",
        `${String.fromCharCode(65 + col)}${idx + 2}`,
        String(merged[key] ?? "")
      );
    }
    return this.toStudent(merged as Record<string, string>);
  }

  async registerStudent(input: RegisterInput) {
    const existing = await this.findStudentByEmail(input.email);
    if (existing) throw new Error("This email is already registered.");
    const rec: Record<string, string> = {
      id: nanoid(10),
      name: input.name.trim(),
      klass: input.klass,
      exam: input.exam,
      email: normalizeEmail(input.email),
      passwordHash: input.passwordHash ?? "",
      tgUsername: input.tgUsername?.trim() ?? "",
      discordUsername: input.discordUsername?.trim() ?? "",
      dailyTargetMin: String(input.dailyTargetMin),
      mainChallenge: input.mainChallenge ?? "",
      status: "new",
      createdAt: new Date().toISOString(),
    };
    await this.append("students", rec);
    return this.toStudent(rec)!;
  }

  async login(email: string, password: string): Promise<Student | null> {
    const student = await this.findStudentByEmail(email);
    if (!student || !student.passwordHash) return null;
    const isValid = await verifyPassword(password, student.passwordHash);
    return isValid ? student : null;
  }

  async getRooms() {
    const rows = await this.tab("rooms");
    return rows
      .filter((r) => r.active !== "false")
      .map((r) => ({
        id: r.id,
        name: r.name,
        day: r.day,
        time: r.time,
        durationMin: Number(r.durationMin) || 120,
        zoomLink: r.zoomLink || undefined,
        examFocus: r.examFocus || undefined,
        active: r.active !== "false",
      } satisfies Room));
  }

  async getMentorSessions() {
    const rows = await this.tab("mentors");
    const today = todayKey();
    return rows
      .filter((r) => r.date >= today)
      .map((r) => ({
        id: r.id,
        mentorName: r.mentorName,
        topic: r.topic,
        date: r.date,
        time: r.time,
        zoomLink: r.zoomLink || undefined,
        notes: r.notes || undefined,
        recordingLink: undefined,
      } satisfies MentorSession));
  }

  async getActiveChallenge() {
    const rows = await this.tab("challenges");
    const row = rows
      .filter((r) => r.active === "true")
      .sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      type: row.type as Challenge["type"],
      startDate: row.startDate,
      endDate: row.endDate,
      rules: row.rules,
      active: true,
    } satisfies Challenge;
  }

  async getChallenge(id: string) {
    const row = (await this.tab("challenges")).find((r) => r.id === id);
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      type: row.type as Challenge["type"],
      startDate: row.startDate,
      endDate: row.endDate,
      rules: row.rules,
      active: row.active === "true",
    } satisfies Challenge;
  }

  async listChallenges() {
    return (await this.tab("challenges"))
      .map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type as Challenge["type"],
        startDate: row.startDate,
        endDate: row.endDate,
        rules: row.rules,
        active: row.active === "true",
      }))
      .sort((a, b) => Number(b.active) - Number(a.active) || b.startDate.localeCompare(a.startDate));
  }

  async isParticipant(challengeId: string, studentId: string) {
    const rows = await this.tab("participants");
    return rows.some(
      (r) => r.challengeId === challengeId && r.studentId === studentId
    );
  }

  async countParticipants(challengeId: string) {
    return (await this.tab("participants")).filter(
      (r) => r.challengeId === challengeId
    ).length;
  }

  async listStudyLogs(studentId: string, limit = 60): Promise<StudyLog[]> {
    const rows = (await this.tab("logs")).filter((l) => l.studentId === studentId);
    return rows
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit)
      .map(
        (l) =>
          ({
            id: l.id,
            studentId: l.studentId,
            date: l.date,
            minutes: Number(l.minutes) || 0,
            roomId: l.roomId || undefined,
            note: l.note || undefined,
            source: l.source === "timer" ? "timer" : "manual",
          }) satisfies StudyLog
      );
  }

  async listMentorSessions({ includePast = false } = {}) {
    const rows = await this.tab("mentors");
    const today = todayKey();
    return rows
      .filter((r) => includePast || r.date >= today)
      .map((m) => ({
        id: m.id,
        mentorName: m.mentorName,
        topic: m.topic,
        date: m.date,
        time: m.time,
        zoomLink: m.zoomLink || undefined,
        notes: m.notes || undefined,
        recordingLink: m.recordingLink || undefined,
      })) satisfies MentorSession[];
  }

  async getStudyTotals(studentId: string, sinceKey: string) {
    const mine = (await this.tab("logs")).filter((l) => l.studentId === studentId);
    const num = (l: Record<string, string>) => Number(l.minutes) || 0;
    return {
      windowMinutes: mine.filter((l) => l.date >= sinceKey).reduce((s, l) => s + num(l), 0),
      totalMinutes: mine.reduce((s, l) => s + num(l), 0),
      totalSessions: mine.length,
    };
  }

  async getLeaderboardRows(sinceKey: string) {
    const students = await this.tab("students");
    const logs = await this.tab("logs");
    const checkins = await this.tab("checkins");
    return students.map((s) => ({
      studentId: s.id,
      name: s.name,
      klass: s.klass,
      exam: s.exam,
      minutes: logs
        .filter((l) => l.studentId === s.id && l.date >= sinceKey)
        .reduce((sum, l) => sum + (Number(l.minutes) || 0), 0),
      checkinsHit: checkins.filter(
        (c) => c.studentId === s.id && c.date >= sinceKey && c.status !== "miss"
      ).length,
    }));
  }

  async revokeSessions() {}

  async getTokenVersion() {
    return 0;
  }

  async getSettings() {
    const rows = await this.tab("settings");
    const map = Object.fromEntries(
      rows.map((r) => [r.key, r.value])
    );
    return {
      announcement: map.announcement || undefined,
      activeChallengeId: map.activeChallengeId || undefined,
      telegramUrl: map.telegramUrl || undefined,
      discordUrl: map.discordUrl || undefined,
    } satisfies PublicSettings;
  }

  async logStudy(studentId: string, input: StudyLogInput) {
    const rec: Record<string, string> = {
      id: nanoid(10),
      studentId,
      date: todayKey(),
      minutes: String(Math.max(1, Math.round(input.minutes))),
      roomId: input.roomId ?? "",
      note: input.note ?? "",
      source: input.source ?? "manual",
    };
    await this.append("logs", rec);
    return {
      id: rec.id,
      studentId,
      date: rec.date,
      minutes: Number(rec.minutes),
      roomId: input.roomId,
      note: input.note,
      source: rec.source,
    } as StudyLog;
  }

  async upsertCheckin(studentId: string, input: CheckinInput) {
    const date = todayKey();
    const existing = await this.tab("checkins");
    const row = existing.find(
      (r) => r.studentId === studentId && r.date === date
    );
    const completed = Math.max(0, Math.round(input.completedMin));
    const target = input.targetMin ?? (row ? Number(row.targetMin) : 300);
    const status = completed >= target ? "hit" : completed > 0 ? "partial" : "miss";
    const rec: Record<string, string> = {
      id: row?.id ?? nanoid(10),
      studentId,
      date,
      targetMin: String(target),
      completedMin: String(completed),
      status,
      note: input.note ?? "",
    };
    if (row) {
      const idx = existing.indexOf(row);
      const headers = this.ship.checkins;
      for (const h of headers) {
        await this.admin.updateCell(
          "checkins",
          `${String.fromCharCode(65 + headers.indexOf(h))}${idx + 2}`,
          rec[h] ?? ""
        );
      }
      return { ...rec, targetMin: target, completedMin: completed } as unknown as Checkin;
    }
    await this.append("checkins", rec);
    return { ...rec, targetMin: target, completedMin: completed } as unknown as Checkin;
  }

  async joinChallenge(studentId: string, challengeId: string) {
    const rows = await this.tab("participants");
    if (
      rows.some((r) => r.challengeId === challengeId && r.studentId === studentId)
    )
      return;
    await this.append("participants", {
      challengeId,
      studentId,
      joinedAt: new Date().toISOString(),
    });
  }

  async submitFeedback(studentId: string, input: FeedbackInput) {
    const rec: Record<string, string> = {
      studentId,
      helpsConsistency: String(input.helpsConsistency),
      sessionsAttended: String(input.sessionsAttended),
      liked: input.liked,
      improve: input.improve,
      joinAgain: String(input.joinAgain),
      wouldPay: String(input.wouldPay),
      features: input.features ?? "",
      submittedAt: new Date().toISOString(),
    };
    await this.append("feedback", rec);
    return rec;
  }

  async getDashboard(studentId: string): Promise<DashboardMe> {
    const student = await this.getStudent(studentId);
    if (!student) throw new Error("Student not found.");

    const logs = (await this.tab("logs")).filter((l) => l.studentId === studentId);
    const checkins = (await this.tab("checkins")).filter((c) => c.studentId === studentId);
    const challenge = await this.getActiveChallenge();

    return buildDashboard({
      student,
      logs: logs.map((l) => ({
        id: l.id,
        studentId: l.studentId,
        date: l.date,
        minutes: Number(l.minutes) || 0,
        roomId: l.roomId || undefined,
        note: l.note || undefined,
        source: l.source === "timer" ? "timer" : "manual",
      })),
      checkins: checkins.map((c) => ({
        id: c.id,
        studentId: c.studentId,
        date: c.date,
        targetMin: Number(c.targetMin) || 300,
        completedMin: Number(c.completedMin) || 0,
        status: (c.status as Checkin["status"]) ?? "miss",
        note: c.note || undefined,
      })),
      rooms: await this.getRooms(),
      challenge,
      joined: challenge
        ? (await this.tab("participants")).some(
            (p) => p.challengeId === challenge.id && p.studentId === studentId
          )
        : false,
      mentorSessions: await this.getMentorSessions(),
      announcement: (await this.getSettings()).announcement,
    });
  }
}
