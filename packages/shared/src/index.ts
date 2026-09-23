export const EXAMS = ["JEE", "NEET", "CUET", "Boards", "Other"] as const;
export const CLASSES = ["9", "10", "11", "12", "Dropper", "Other"] as const;

export const CHALLENGE_TYPES = ["7day", "14day", "30day", "100hr", "revision"] as const;

export const CHECKIN_STATUS = ["hit", "partial", "miss"] as const;

export const STUDENT_STATUS = ["new", "active", "inactive", "mentor", "member"] as const;

export interface Student {
  id: string;
  name: string;
  klass: string;
  exam: string;
  email: string;
  tgUsername?: string;
  discordUsername?: string;
  dailyTargetMin: number;
  mainChallenge?: string;
  status: StudentStatus;
  createdAt: string;
}

export type StudentStatus = (typeof STUDENT_STATUS)[number];
export type Exam = (typeof EXAMS)[number];
export type ChallengeType = (typeof CHALLENGE_TYPES)[number];
export type CheckinStatus = (typeof CHECKIN_STATUS)[number];

export interface Room {
  id: string;
  name: string;
  day: string;
  time: string;
  durationMin: number;
  zoomLink?: string;
  examFocus?: string;
  active: boolean;
}

export interface StudyLog {
  id: string;
  studentId: string;
  date: string;
  minutes: number;
  roomId?: string;
  note?: string;
  source: "timer" | "manual";
}

export interface Checkin {
  id: string;
  studentId: string;
  date: string;
  targetMin: number;
  completedMin: number;
  status: CheckinStatus;
  note?: string;
}

export interface Challenge {
  id: string;
  name: string;
  type: ChallengeType;
  startDate: string;
  endDate: string;
  rules: string;
  active: boolean;
}

export interface ChallengeParticipant {
  challengeId: string;
  studentId: string;
  joinedAt: string;
}

export interface MentorSession {
  id: string;
  mentorName: string;
  topic: string;
  date: string;
  time: string;
  zoomLink?: string;
  notes?: string;
  recordingLink?: string;
}

export interface Feedback {
  studentId: string;
  helpsConsistency: boolean;
  sessionsAttended: number;
  liked: string;
  improve: string;
  joinAgain: boolean;
  wouldPay: boolean;
  features?: string;
  submittedAt: string;
}

export interface PublicSettings {
  announcement?: string;
  activeChallengeId?: string;
  discordUrl?: string;
  telegramUrl?: string;
}

export interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface RegisterInput {
  name: string;
  klass: string;
  exam: string;
  email: string;
  tgUsername?: string;
  discordUsername?: string;
  dailyTargetMin: number;
  mainChallenge?: string;
  source?: string;
}

export interface CheckinInput {
  targetMin?: number;
  completedMin: number;
  note?: string;
}

export interface StudyLogInput {
  minutes: number;
  roomId?: string;
  note?: string;
  source?: "timer" | "manual";
}

export interface FeedbackInput {
  helpsConsistency: boolean;
  sessionsAttended: number;
  liked: string;
  improve: string;
  joinAgain: boolean;
  wouldPay: boolean;
  features?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

export function normalizeEmail(v: string): string {
  return v.trim().toLowerCase();
}

export function minMax(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export const MOCK_ALLOWED: string[] = ["1", "2", "3", "4", "5", "6", "7"];

export function otpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export interface DayBuckets {
  label: string;
  minutes: number;
}

export interface DashboardMe {
  student: Student;
  todayMinutes: number;
  todayTargetMin: number;
  weekMinutes: number;
  weekBuckets: DayBuckets[];
  streakDays: number;
  lastCheckin: Checkin | null;
  rooms: Room[];
  activeChallenge: Challenge | null;
  challengeProgress: { joined: boolean; dayStatuses: (CheckinStatus | null)[] };
  mentorSessions: MentorSession[];
  announcement?: string;
}