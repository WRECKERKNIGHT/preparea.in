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
import { normalizeEmail, isEmail, otpCode, minMax, trialInfo } from "@preparea/shared";
import type { CheckinStatus } from "@preparea/shared";
import { getSheetsAdmin } from "@/lib/sheets";
import { openSqliteStore } from "@/lib/sqlite";

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
      const d = new Date();
      d.setDate(d.getDate() - offset);
      const k = localDateKey(d);
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

  findStudentByEmail(email: string) {
    const norm = normalizeEmail(email);
    return this.students.find((s) => s.email === norm) ?? null;
  }

  getStudent(id: string) {
    return this.students.find((s) => s.id === id) ?? null;
  }

  registerStudent(input: RegisterInput) {
    if (!input.name.trim()) throw new Error("Name is required.");
    if (!isEmail(input.email)) throw new Error("Valid email is required.");
    if (!input.klass || !input.exam)
      throw new Error("Class and exam are required.");
    if (!minMax(input.dailyTargetMin, 15, 720))
      throw new Error("Daily target must be 15–720 minutes.");
    if (this.findStudentByEmail(input.email))
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
    this.students.push(student);
    return student;
  }

  updateStudent(id: string, patch: Partial<Student>) {
    const s = this.getStudent(id);
    if (!s) return null;
    Object.assign(s, patch);
    return s;
  }

  requestOtp(email: string, purpose: string) {
    const norm = normalizeEmail(email);
    const code = otpCode();
    this.otps.set(norm, {
      code,
      purpose,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    return { code };
  }

  verifyOtp(email: string, code: string) {
    const rec = this.otps.get(normalizeEmail(email));
    if (!rec || rec.code !== code.trim() || rec.expiresAt < Date.now())
      return null;
    this.otps.delete(normalizeEmail(email));
    return this.findStudentByEmail(email);
  }

  verifyDemo() {
    return this.students[0];
  }

  getRooms() {
    return this.rooms;
  }

  getMentorSessions() {
    return this.mentors;
  }

  getActiveChallenge() {
    return this.challenge;
  }

  getSettings() {
    return this.settings;
  }

  logStudy(studentId: string, input: StudyLogInput) {
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

  upsertCheckin(studentId: string, input: CheckinInput) {
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

  joinChallenge(studentId: string, challengeId: string) {
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

  submitFeedback(studentId: string, input: FeedbackInput) {
    return {
      studentId,
      ...input,
      submittedAt: new Date().toISOString(),
    };
  }

  getDashboard(studentId: string): DashboardMe {
    const student = this.getStudent(studentId);
    if (!student) throw new Error("Student not found.");

    const logs = this.logs.filter((l) => l.studentId === studentId);
    const checkinsList = this.checkins.filter(
      (c) => c.studentId === studentId
    );

    const today = todayKey();
    const todayMinutes = logs
      .filter((l) => l.date === today)
      .reduce((sum, l) => sum + l.minutes, 0);

    const weekBuckets = [] as DashboardMe["weekBuckets"];
    let weekMinutes = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = localDateKey(d);
      const minutes = logs
        .filter((l) => l.date === k)
        .reduce((sum, l) => sum + l.minutes, 0);
      weekMinutes += minutes;
      weekBuckets.push({
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
        minutes,
      });
    }

    const doneDates = new Set<string>();
    for (const c of checkinsList)
      if (c.status !== "miss") doneDates.add(c.date);
    for (const l of logs) if (l.minutes > 0) doneDates.add(l.date);

    let streak = 0;
    for (let i = 0; i < 90; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (doneDates.has(localDateKey(d))) streak++;
      else break;
    }

    const lastCheckin = checkinsList.length
      ? [...checkinsList].sort((a, b) => b.date.localeCompare(a.date))[0]
      : null;

    const challenge = this.challenge;
    let challengeProgress: DashboardMe["challengeProgress"] = {
      joined: false,
      dayStatuses: [],
    };
    if (challenge) {
      const joined = this.participants.some(
        (p) => p.challengeId === challenge.id && p.studentId === studentId
      );
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
        const c = checkinsList.find((x) => x.date === k);
        dayStatuses.push(c?.status ?? "miss");
      }
      challengeProgress = { joined, dayStatuses };
    }

    const lastCheckinToday =
      lastCheckin?.date === today ? lastCheckin : null;

    return {
      student,
      trial: trialInfo(student.createdAt),
      todayMinutes,
      todayTargetMin:
        lastCheckinToday?.targetMin ?? student.dailyTargetMin,
      weekMinutes,
      weekBuckets,
      streakDays: streak,
      lastCheckin: lastCheckinToday,
      rooms: this.rooms.filter((r) => r.active),
      activeChallenge: challenge,
      challengeProgress,
      mentorSessions: this.mentors,
      announcement: this.settings.announcement,
    };
  }
}

// ---------------------------------------------------------------------------
// Store façade
// ---------------------------------------------------------------------------

export interface Store {
  findStudentByEmail(
    email: string
  ): Student | null | Promise<Student | null>;
  getStudent(id: string): Student | null | Promise<Student | null>;
  registerStudent(
    input: RegisterInput
  ): Student | Promise<Student>;
  updateStudent(
    id: string,
    patch: Partial<Student>
  ): Student | null | Promise<Student | null>;
  requestOtp(
    email: string,
    purpose: string
  ): { code: string } | Promise<{ code: string }>;
  verifyOtp(
    email: string,
    code: string
  ): Student | null | Promise<Student | null>;
  getRooms(): Room[] | Promise<Room[]>;
  getMentorSessions():
    | MentorSession[]
    | Promise<MentorSession[]>;
  getActiveChallenge(): Challenge | null | Promise<Challenge | null>;
  getSettings(): PublicSettings | Promise<PublicSettings>;
  logStudy(
    studentId: string,
    input: StudyLogInput
  ): StudyLog | Promise<StudyLog>;
  upsertCheckin(
    studentId: string,
    input: CheckinInput
  ): Checkin | Promise<Checkin>;
  joinChallenge(studentId: string, challengeId: string): void | Promise<void>;
  submitFeedback(
    studentId: string,
    input: FeedbackInput
  ): unknown | Promise<unknown>;
  getDashboard(studentId: string): DashboardMe | Promise<DashboardMe>;
  isMock(): boolean;
}

const mock = new MockStore();

export function getStore(): Store {
  const admin = getSheetsAdmin();
  if (admin) return new SheetsStore(admin);
  const sqlite = openSqliteStore();
  if (sqlite) return sqlite;
  return mock;
}

// ---------------------------------------------------------------------------
// Google Sheets backend
// ---------------------------------------------------------------------------

class SheetsStore implements Store {
  private admin: import("@/lib/sheets").SheetsAdmin;
  private ship = {
    students: ["id", "name", "klass", "exam", "email", "tgUsername", "discordUsername", "dailyTargetMin", "mainChallenge", "status", "createdAt"],
    logs: ["id", "studentId", "date", "minutes", "roomId", "note", "source"],
    checkins: ["id", "studentId", "date", "targetMin", "completedMin", "status", "note"],
    rooms: ["id", "name", "day", "time", "durationMin", "zoomLink", "examFocus", "active"],
    mentors: ["id", "mentorName", "topic", "date", "time", "zoomLink", "notes", "recordingLink"],
    challenges: ["id", "name", "type", "startDate", "endDate", "rules", "active"],
    participants: ["challengeId", "studentId", "joinedAt"],
    feedback: ["studentId", "helpsConsistency", "sessionsAttended", "liked", "improve", "joinAgain", "wouldPay", "features", "submittedAt"],
    settings: ["key", "value"],
    otps: ["email", "codeHash", "purpose", "expiresAt"],
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

  async requestOtp(email: string, purpose: string) {
    const code = otpCode();
    const expiresAt = String(Date.now() + 10 * 60 * 1000);
    const existing = await this.tab("otps");
    if (!existing.length) {
      await this.admin.appendRows("otps", [
        ["email", "codeHash", "purpose", "expiresAt"],
      ]);
    }
    await this.admin.appendRows("otps", [
      [
        normalizeEmail(email),
        hash(email + purpose + code),
        purpose,
        expiresAt,
      ],
    ]);
    return { code };
  }

  async verifyOtp(email: string, code: string) {
    const rows = await this.tab("otps");
    const norm = normalizeEmail(email);
    const hit = rows.find(
      (r) =>
        r.email?.toLowerCase() === norm &&
        hash(norm + r.purpose + code) === r.codeHash &&
        Number(r.expiresAt) > Date.now()
    );
    if (!hit) return null;
    return this.findStudentByEmail(norm);
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

    const done = new Set<string>();
    for (const c of checkins) if (c.status !== "miss") done.add(c.date);
    for (const l of logs) if (Number(l.minutes) > 0) done.add(l.date);
    let streak = 0;
    for (let i = 0; i < 90; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (done.has(localDateKey(d))) streak++;
      else break;
    }

    const lastCheckinRow = [...checkins].sort((a, b) => b.date.localeCompare(a.date))[0];
    const lastCheckin = lastCheckinRow
      ? {
          id: lastCheckinRow.id,
          studentId,
          date: lastCheckinRow.date,
          targetMin: Number(lastCheckinRow.targetMin) || 300,
          completedMin: Number(lastCheckinRow.completedMin) || 0,
          status: lastCheckinRow.status as Checkin["status"],
          note: lastCheckinRow.note || undefined,
        }
      : null;

    const challenge = await this.getActiveChallenge();
    let challengeProgress: DashboardMe["challengeProgress"] = {
      joined: false,
      dayStatuses: [],
    };
    if (challenge) {
      const participants = await this.tab("participants");
      const joined = participants.some(
        (p) => p.challengeId === challenge.id && p.studentId === studentId
      );
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
        const c = checkins.find((x) => x.date === k);
        dayStatuses.push(c ? (c.status as CheckinStatus) : "miss");
      }
      challengeProgress = { joined, dayStatuses };
    }

    return {
      student,
      trial: trialInfo(student.createdAt),
      todayMinutes,
      todayTargetMin:
        lastCheckin?.date === today ? lastCheckin.targetMin : student.dailyTargetMin,
      weekMinutes,
      weekBuckets,
      streakDays: streak,
      lastCheckin: lastCheckin?.date === today ? lastCheckin : null,
      rooms: (await this.getRooms()).filter((r) => r.active),
      activeChallenge: challenge,
      challengeProgress,
      mentorSessions: await this.getMentorSessions(),
      announcement: (await this.getSettings()).announcement,
    };
  }
}