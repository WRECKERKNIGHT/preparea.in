import { useState, useEffect, useCallback } from "react";
import type { StudyLogInput } from "@preparea/shared";
import { api, loadSession } from "@/lib/api";
import { File, Paths } from "expo-file-system";

const TIMER_STATE_KEY = "study-timer-state";

interface SavedTimerState {
  isRunning?: boolean;
  elapsedSeconds?: number;
  roomId?: string | null;
  note?: string;
}

function timerFile(): File {
  return new File(Paths.document, `${TIMER_STATE_KEY}.json`);
}

async function readSavedState(): Promise<SavedTimerState | null> {
  try {
    const file = timerFile();
    if (!file.exists) return null;
    return JSON.parse(await file.text()) as SavedTimerState;
  } catch {
    return null;
  }
}

async function writeSavedState(state: SavedTimerState): Promise<void> {
  try {
    const file = timerFile();
    if (!file.exists) {
      file.create({ intermediates: true, overwrite: true });
    }
    file.write(JSON.stringify(state));
  } catch (error) {
    console.debug("Failed to persist timer state:", error);
  }
}

/**
 * Hook for managing a study timer with file-based persistence
 */
export function useStudyTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setRoomId(null);
    setNote("");
    try {
      const file = timerFile();
      if (file.exists) file.delete();
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
  }, []);

  const saveStudyLog = useCallback(async () => {
    if (elapsedSeconds <= 0) return;
    try {
      const session = await loadSession();
      if (!session) {
        throw new Error("No active session");
      }

      const input: StudyLogInput = {
        minutes: Math.max(1, Math.round(elapsedSeconds / 60)),
        roomId: roomId ?? undefined,
        note,
        source: "timer",
      };
      await api(`/api/logs`, {
        method: "POST",
        body: input,
        token: session.token,
      });
      resetTimer();
    } catch (error) {
      console.error("Failed to save study log:", error);
      // Keep the elapsed time so the user can retry.
    }
  }, [elapsedSeconds, roomId, note, resetTimer]);

  // Restore saved state after mount.
  useEffect(() => {
    let cancelled = false;
    void readSavedState().then((saved) => {
      if (!saved || cancelled) return;
      setElapsedSeconds(saved.elapsedSeconds ?? 0);
      setIsRunning(saved.isRunning ?? false);
      setRoomId(saved.roomId ?? null);
      setNote(saved.note ?? "");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Mirror state to disk whenever it changes.
  useEffect(() => {
    void writeSavedState({ isRunning, elapsedSeconds, roomId, note });
  }, [isRunning, elapsedSeconds, roomId, note]);

  // Tick once per second while running.
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = useCallback(
    async (roomIdParam: string | null, noteParam: string) => {
      setRoomId(roomIdParam);
      setNote(noteParam);
      setIsRunning(true);
      setElapsedSeconds(0);
      await writeSavedState({
        isRunning: true,
        elapsedSeconds: 0,
        roomId: roomIdParam,
        note: noteParam,
      });
    },
    []
  );

  const stopTimer = useCallback(async () => {
    setIsRunning(false);
    // Persist the session as part of stopping, so callers never have to
    // remember a second explicit save.
    await saveStudyLog();
  }, [saveStudyLog]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    isRunning,
    elapsedSeconds: formatTime(elapsedSeconds),
    rawElapsedSeconds: elapsedSeconds,
    roomId,
    note,
    setNote,
    startTimer,
    stopTimer,
    resetTimer,
    saveStudyLog,
  };
}
