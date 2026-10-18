import { useState, useEffect, useCallback } from "react";
import type { StudyLogInput } from "@preparea/shared";
import { api, saveSession, fetchMe } from "@/lib/api";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

/**
 * Hook for managing a study timer with persistence using AsyncStorage
 */
export function useStudyTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  const TIMER_STATE_KEY = "study-timer-state";

  // Load saved timer state from AsyncStorage on init
  useEffect(() => {
    loadTimerState();
  }, []);

  const loadTimerState = useCallback(async () => {
    try {
      const content = await FileSystem.readAsStringAsync(
        `${FileSystem.documentDirectory}${TIMER_STATE_KEY}.json`,
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      if (content) {
        const state = JSON.parse(content);
        setElapsedSeconds(state.elapsedSeconds ?? 0);
        setIsRunning(state.isRunning ?? false);
        setRoomId(state.roomId ?? null);
        setNote(state.note ?? "");
      }
    } catch (error) {
      // File doesn't exist yet or other error - that's OK
      console.debug("No saved timer state found:", error.message);
    }
  }, []);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    saveTimerState();
  }, [isRunning, elapsedSeconds, roomId, note]);

  const saveTimerState = useCallback(async () => {
    try {
      const state = {
        isRunning,
        elapsedSeconds,
        roomId,
        note,
      };
      const content = JSON.stringify(state);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}${TIMER_STATE_KEY}.json`,
        content,
        { encoding: FileSystem.EncodingType.UTF8 }
      );
    } catch (error) {
      console.error("Failed to save timer state:", error);
    }
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
      await saveTimerState();
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
    // Delete the timer state file
    FileSystem.deleteAsync(
      `${FileSystem.documentDirectory}${TIMER_STATE_KEY}.json`,
      { idempotent: true }
    ).catch(console.error);
  }, []);

  const saveStudyLog = useCallback(async () => {
    if (elapsedSeconds > 0) {
      try {
        // Get current session to get auth token
        const session = await loadSession();
        if (!session) {
          throw new Error("No active session");
        }

        const input: StudyLogInput = {
          minutes: Math.round(elapsedSeconds / 60),
          roomId,
          note,
          source: "timer",
        };
        await api(`/api/logs`, {
          method: "POST",
          body: input,
          token: session.token,
        });
        // Reset after successful save
        resetTimer();
      } catch (error) {
        console.error("Failed to save study log:", error);
        // Keep timer running so user can retry
        // In a real app, we might show a retry option
      }
    }
  }, [elapsedSeconds, roomId, note, resetTimer]);

  const loadSession = useCallback(async () => {
    try {
      if (globalThis.platform === "web") {
        const raw = globalThis.localStorage?.getItem("pa_token");
        if (!raw) return null;
        return JSON.parse(raw);
      }
      const file = new File(FileSystem.documentDirectory, "session.json");
      const exists = await FileSystem.getInfo(file.uri);
      if (!exists.exists) return null;
      const content = await FileSystem.readAsStringAsync(file.uri);
      return JSON.parse(content);
    } catch {
      return null;
    }
  }, []);

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