"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button, Input, T } from "@/components/ui";

interface DatePickerProps {
  start: Date;
  end: Date;
  onChange: (range: { start: Date; end: Date }) => void;
}

function toDateInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function DatePicker({ start, end, onChange }: DatePickerProps) {
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
          {selectedStart.toLocaleDateString()} – {selectedEnd.toLocaleDateString()}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 rounded-md border border-ink/10 bg-white p-4 shadow-lg">
          <div className="space-y-4">
            <div>
              <T className="mb-2 block font-medium">Start Date</T>
              <Input
                type="date"
                value={toDateInput(selectedStart)}
                onChange={(e) => {
                  if (e.target.value) setSelectedStart(new Date(e.target.value));
                }}
                className="w-full"
              />
            </div>
            <div>
              <T className="mb-2 block font-medium">End Date</T>
              <Input
                type="date"
                value={toDateInput(selectedEnd)}
                onChange={(e) => {
                  if (e.target.value) setSelectedEnd(new Date(e.target.value));
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

export default DatePicker;
