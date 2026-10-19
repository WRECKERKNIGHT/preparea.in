import { useState } from "react";
import { View, Text, Button, TextInput, Alert, TouchableOpacity } from "react-native";
import { useStudyTimer } from "@/lib/use-study-timer";
import { useRouter } from "expo-router";

const Rooms = {
  "room-morning": { name: "Morning Room", day: "Daily", time: "5:00 – 9:00 AM" },
  "room-afternoon": { name: "Afternoon Room", day: "Daily", time: "12:00 – 4:00 PM" },
  "room-evening": { name: "Evening Room", day: "Daily", time: "5:00 – 9:00 PM" },
  "room-night": { name: "Night Room", day: "Daily", time: "9:00 PM – 1:00 AM" },
} as const;

export default function StudyTimerScreen() {
  const {
    isRunning,
    rawElapsedSeconds,
    note,
    setNote,
    startTimer,
    stopTimer,
    resetTimer
  } = useStudyTimer();

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleStart = () => {
    if (!selectedRoom) {
      Alert.alert("Please select a study room");
      return;
    }
    startTimer(selectedRoom, note);
  };

  const handleStop = async () => {
    setIsSaving(true);
    try {
      await stopTimer(); // stopTimer persists the session
      router.replace("/(tabs)"); // Redirect to main tabs after stopping
    } catch (error) {
      console.error("Error saving study log:", error);
      Alert.alert("Error", "Failed to save study session. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Study Timer
      </Text>

      {/* Timer Display */}
      <Text style={{
        fontSize: 48,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
        color: isRunning ? "#10b981" : "#6b7280"
      }}>
        {formatTime(rawElapsedSeconds)}
      </Text>

      {/* Status Indicator */}
      {isRunning && (
        <Text style={{
          textAlign: "center",
          color: "#10b981",
          fontSize: 16,
          marginBottom: 20
        }}>
          ● Study session in progress
        </Text>
      )}

      {/* Controls */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        {!isRunning && rawElapsedSeconds === 0 ? (
          <>
            <Button
              title="Start Study Session"
              color="#10b981"
              onPress={handleStart}
              disabled={!selectedRoom}
            />
            <Button
              title="Reset"
              color="#6b7280"
              onPress={resetTimer}
            />
          </>
        ) : isRunning ? (
          <>
            <Button
              title="Stop & Save"
              color="#ef4444"
              onPress={handleStop}
              disabled={isSaving}
            />
            <Button
              title="Cancel"
              color="#6b7280"
              onPress={() => {
                setNote("");
                setSelectedRoom(null);
                resetTimer();
              }}
            />
          </>
        ) : (
          <>
            <Button
              title="Resume"
              color="#10b981"
              onPress={handleStart}
            />
            <Button
              title="Reset"
              color="#6b7280"
              onPress={resetTimer}
            />
          </>
        )}
      </View>

      {/* Room Selection */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Study Room
        </Text>
        {Object.keys(Rooms).map((roomKey) => {
          const room = Rooms[roomKey as keyof typeof Rooms];
          const isSelected = selectedRoom === roomKey;
          return (
            <TouchableOpacity
              key={roomKey}
              onPress={() => setSelectedRoom(roomKey)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                backgroundColor: isSelected ? "#dbeafe" : "#f9fafb",
                borderRadius: 8,
                marginBottom: 8,
                borderWidth: isSelected ? 2 : 0,
                borderColor: isSelected ? "#3b82f6" : "transparent",
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 100,
                backgroundColor: isSelected ? "#3b82f6" : "#e5e7eb",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12
              }}>
                {isSelected && (
                  <Text style={{ color: "white", fontSize: 10 }}>✓</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {room.name}
                </Text>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>
                  {room.day} • {room.time}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notes */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Session Notes (optional)
        </Text>
        <TextInput
          placeholder="What did you focus on? Any breakthroughs?"
          value={note}
          onChangeText={setNote}
          multiline
          style={{
            minHeight: 80,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 8,
            padding: 12,
          }}
        />
      </View>

      {/* Footer with quick actions */}
      <View style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "row",
        gap: 10
      }}>
        <Button
          title="History"
          color="#6b7280"
          onPress={() => router.push("/study-history")}
        />
        <Button
          title="Analytics"
          color="#3b82f6"
          onPress={() => router.push("/analytics")}
        />
      </View>
    </View>
  );
}