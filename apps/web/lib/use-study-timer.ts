"use client";

import { useState, useEffect, useCallback } from "react";
import type { StudyLogInput } from "@preparea/shared";
import { api } from "@/lib/client-api";

const STORAGE_KEY = "study-timer-state";

interface SavedTimerState {
  isRunning?: boolean;
  elapsedSeconds?: number;
  roomId?: string | null;
  note?: string;
}

function readSavedState(): SavedTimerState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedTimerState) : null;
  } catch {
    return null;
  }
}

function writeSavedState(state: SavedTimerState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota/serialization failures — the timer still works in memory.
  }
}

/**
 * Hook for managing a study timer with persistence
 */
export function useStudyTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setRoomId(null);
    setNote("");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore — nothing to clean up if storage is unavailable.
    }
  }, []);

  const saveStudyLog = useCallback(async () => {
    if (elapsedSeconds <= 0) return;
    try {
      const input: StudyLogInput = {
        minutes: Math.max(1, Math.round(elapsedSeconds / 60)),
        roomId: roomId ?? undefined,
        note,
        source: "timer",
      };
      await api("/api/logs", { method: "POST", body: input });
      resetTimer();
    } catch (error) {
      console.error("Failed to save study log:", error);
      // Keep the elapsed time so the user can retry.
    }
  }, [elapsedSeconds, roomId, note, resetTimer]);

  // Restore saved state after hydration so server and client markup match.
  useEffect(() => {
    const saved = readSavedState();
    if (!saved) return;
    const timer = setTimeout(() => {
      setElapsedSeconds(saved.elapsedSeconds ?? 0);
      setIsRunning(saved.isRunning ?? false);
      setRoomId(saved.roomId ?? null);
      setNote(saved.note ?? "");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Mirror state to localStorage whenever it changes.
  useEffect(() => {
    writeSavedState({ isRunning, elapsedSeconds, roomId, note });
  }, [isRunning, elapsedSeconds, roomId, note]);

  // Tick once per second while running.
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const stopTimer = useCallback(async () => {
    setIsRunning(false);
    // Persist the session as part of stopping, so callers never have to
    // remember a second explicit save.
    await saveStudyLog();
  }, [saveStudyLog]);

  const startTimer = useCallback(
    async (roomIdParam: string | null, noteParam: string) => {
      setRoomId(roomIdParam);
      setNote(noteParam);
      setIsRunning(true);
      setElapsedSeconds(0);
      writeSavedState({
        isRunning: true,
        elapsedSeconds: 0,
        roomId: roomIdParam,
        note: noteParam,
      });
    },
    []
  );

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
