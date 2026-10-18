import { useState, useEffect, useCallback } from "react";
import type { StudyLogInput } from "@preparea/shared";
import { api } from "@/lib/api";

/**
 * Hook for managing a study timer with persistence
 */
export function useStudyTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  // Load saved timer state from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem("study-timer-state");
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setElapsedSeconds(state.elapsedSeconds ?? 0);
        setIsRunning(state.isRunning ?? false);
        setRoomId(state.roomId ?? null);
        setNote(state.note ?? "");
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      isRunning,
      elapsedSeconds,
      roomId,
      note,
    };
    localStorage.setItem("study-timer-state", JSON.stringify(state));
  }, [isRunning, elapsedSeconds, roomId, note]);

  // Handle timer ticking
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && elapsedSeconds > 0) {
      // Timer was stopped, save the log
      saveStudyLog();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, elapsedSeconds]);

  const startTimer = useCallback(
    async (roomIdParam: string | null, noteParam: string) => {
      setRoomId(roomIdParam);
      setNote(noteParam);
      setIsRunning(true);
      // Save initial state immediately
      const state = {
        isRunning: true,
        elapsedSeconds: 0,
        roomId: roomIdParam,
        note: noteParam,
      };
      localStorage.setItem("study-timer-state", JSON.stringify(state));
    },
    []
  );

  const stopTimer = useCallback(async () => {
    setIsRunning(false);
    // The useEffect above will handle saving when stopped
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setRoomId(null);
    setNote("");
    localStorage.removeItem("study-timer-state");
  }, []);

  const saveStudyLog = useCallback(async () => {
    if (elapsedSeconds > 0) {
      try {
        const input: StudyLogInput = {
          minutes: Math.round(elapsedSeconds / 60),
          roomId,
          note,
          source: "timer",
        };
        await api(`/api/logs`, {
          method: "POST",
          body: input,
        });
        // Reset after successful save
        resetTimer();
      } catch (error) {
        console.error("Failed to save study log:", error);
        // Keep timer running so user can retry
      }
    }
  }, [elapsedSeconds, roomId, note, resetTimer]);

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