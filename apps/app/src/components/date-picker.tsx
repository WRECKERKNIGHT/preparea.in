import { useState } from "react";
import { View, Text, Button, Modal, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateForInput, formatShortDate } from "@/lib/date-utils";

interface DatePickerProps {
  start: Date;
  end: Date;
  onChange: (range: { start: Date; end: Date }) => void;
}

export default function DatePicker({ start, end, onChange }: DatePickerProps) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedStart, setSelectedStart] = useState(start);
  const [selectedEnd, setSelectedEnd] = useState(end);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const handleConfirmStart = (date: Date) => {
    setSelectedStart(date);
    setStartDatePickerVisibility(false);
  };

  const handleConfirmEnd = (date: Date) => {
    setSelectedEnd(date);
    setEndDatePickerVisibility(false);
  };

  const handleApply = () => {
    onChange({ start: selectedStart, end: selectedEnd });
    setDatePickerVisibility(false);
  };

  return (
    <View>
      <Button
        title={`Date Range: ${formatShortDate(formatDateForInput(selectedStart))} - ${formatShortDate(formatDateForInput(selectedEnd))}`}
        onPress={() => setDatePickerVisibility(true)}
      />

      <Modal
        isVisible={isDatePickerVisible}
        onBackdropPress={() => setDatePickerVisibility(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          margin: 20,
          maxHeight: "80%"
        }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>Select Date Range</Text>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>Start Date</Text>
            <Button
              title={formatShortDate(formatDateForInput(selectedStart))}
              onPress={() => setStartDatePickerVisibility(true)}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>End Date</Text>
            <Button
              title={formatShortDate(formatDateForInput(selectedEnd))}
              onPress={() => setEndDatePickerVisibility(true)}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              title="Cancel"
              color="#6b7280"
              onPress={() => setDatePickerVisibility(false)}
            />
            <Button
              title="Apply"
              color="#3b82f6"
              onPress={handleApply}
            />
          </View>
        </View>
      </Modal>

      {/* Start Date Picker */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        date={selectedStart}
        onConfirm={handleConfirmStart}
        onCancel={() => setStartDatePickerVisibility(false)}
        maximumDate={selectedEnd}
      />

      {/* End Date Picker */}
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        date={selectedEnd}
        onConfirm={handleConfirmEnd}
        onCancel={() => setEndDatePickerVisibility(false)}
        minimumDate={selectedStart}
      />
    </View>
  );
}