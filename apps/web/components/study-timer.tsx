import { useState } from "react";
import { useStudyTimer } from "@/lib/use-study-timer";
import { Button, Input, Textarea, Card, T, TSerif, Badge } from "@/components/ui";
import { useRouter } from "expo-router";
import { Rooms } from "@/components/fx/hero-scene"; // Reuse room selection

export default function StudyTimer() {
  const {
    isRunning,
    elapsedSeconds,
    rawElapsedSeconds,
    roomId,
    note,
    setNote,
    startTimer,
    stopTimer,
    resetTimer,
    saveStudyLog
  } = useStudyTimer();

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const router = useRouter();

  const handleStart = () => {
    if (!selectedRoom) {
      alert("Please select a study room");
      return;
    }
    startTimer(selectedRoom, note);
  };

  const handleStop = async () => {
    await stopTimer();
    await saveStudyLog();
    router.push("/dashboard"); // Redirect to dashboard after stopping
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <TSerif className="mb-4">Study Timer</TSerif>

      {/* Timer Display */}
      <div className="text-5xl font-bold text-center mb-6">
        {elapsedSeconds}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {!isRunning && rawElapsedSeconds === 0 ? (
          <>
            <Button
              onClick={handleStart}
              className="flex-1"
              variant="primary"
            >
              Start Study Session
            </Button>
            <Button
              onClick={resetTimer}
              className="flex-1"
              variant="outline"
            >
              Reset
            </Button>
          </>
        ) : isRunning ? (
          <>
            <Button
              onClick={handleStop}
              className="flex-1"
              variant="destructive"
            >
              Stop & Save
            </Button>
            <Button
              onClick={() => {
                setNote("");
                setSelectedRoom(null);
              }}
              className="flex-1"
              variant="outline"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleStart}
              className="flex-1"
              variant="primary"
            >
              Resume
            </Button>
            <Button
              onClick={resetTimer}
              className="flex-1"
              variant="outline"
            >
              Reset
            </Button>
          </>
        )}
      </div>

      {/* Room Selection */}
      <div className="mb-4">
        <T className="mb-2 font-medium">Study Room</T>
        <div className="space-y-2">
          {Object.keys(Rooms).map((roomKey) => {
            const room = Rooms[roomKey as keyof typeof Rooms];
            return (
              <label key={roomKey} className="flex items-center space-x-3">
                <input
                  type="radio"
                  value={roomKey}
                  checked={selectedRoom === roomKey}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="h-4 w-4 text-primary-600"
                />
                <div>
                  <T className="font-medium">{room.name}</T>
                  <T className="text-xs text-muted-foreground">
                    {room.day} • {room.time}
                  </T>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <T className="mb-2 font-medium">Session Notes (optional)</T>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you focus on? Any breakthroughs?"
          className="min-h-[80px]"
        />
      </div>

      {/* Status Badge */}
      {isRunning && rawElapsedSeconds > 0 && (
        <Badge variant="secondary" className="ml-2">
          {isRunning ? "Running..." : "Paused"}
        </Badge>
      )}
    </Card>
  );
}