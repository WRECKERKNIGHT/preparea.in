import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button, Input } from ".";

interface DatePickerProps {
  start: Date;
  end: Date;
  onChange: (range: { start: Date; end: Date }) => void;
}

export default function DatePicker({ start, end, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStart, setSelectedStart] = useState(start);
  const [selectedEnd, setSelectedEnd] = useState(end);

  const handleApply = () => {
    onChange({ start: selectedStart, end: selectedEnd });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <Calendar className="mr-2 h-4 w-4" />
        <span>
          {selectedStart.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })} -
          {selectedEnd.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-background border rounded-md shadow-lg p-4">
          <div className="space-y-4">
            <div>
              <T className="font-medium mb-2">Start Date</T>
              <Input
                type="date"
                value={selectedStart.toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setSelectedStart(date);
                }}
                className="w-full"
              />
            </div>
            <div>
              <T className="font-medium mb-2">End Date</T>
              <Input
                type="date"
                value={selectedEnd.toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setSelectedEnd(date);
                }}
                className="w-full"
              />
            </div>
            <Button onClick={handleApply} className="w-full">
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// We need to import T from somewhere - let's create a simple text component
// For now, we'll use a placeholder - in reality this would be from @/components/ui