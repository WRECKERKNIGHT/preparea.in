import { prisma } from "@/lib/db";
import { ok, err, readJson } from "@/lib/api";
import { Session } from "@/lib/api";
import { getServerSession } from "@/lib/session";
import type { StudyLogInput, StudyLog } from "@preparea/shared";

export async function POST(req: Request) {
  try {
    // Get session
    const session = await getServerSession(req);
    if (!session) {
      return err("unauthorized", "Unauthorized", 401);
    }

    // Parse body
    const body = await readJson(req);
    const input: StudyLogInput = {
      minutes: body.minutes,
      roomId: body.roomId,
      note: body.note,
      source: body.source ?? "manual",
    };

    // Validate input
    if (input.minutes <= 0) {
      return err("invalid_input", "Minutes must be positive", 400);
    }

    // Create study log
    const log = await prisma.studyLog.create({
      data: {
        studentId: session.student.id,
        minutes: input.minutes,
        roomId: input.roomId ?? undefined,
        note: input.note ?? undefined,
        source: input.source,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      },
    });

    // Transform to StudyLog format
    const studyLog: StudyLog = {
      id: log.id,
      studentId: log.studentId,
      date: log.date,
      minutes: log.minutes,
      roomId: log.roomId,
      note: log.note,
      source: log.source as "timer" | "manual",
    };

    return ok(studyLog);
  } catch (error) {
    console.error("Error creating study log:", error);
    return err("server_error", "Failed to create study log", 500);
  }
}