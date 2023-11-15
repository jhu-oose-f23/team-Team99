import React from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
const { width: screenWidth } = Dimensions.get("window"); // Get the width of the screen

const ScheduleGrid = ({ schedule }) => {
  // Define all days of the week
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const shortFormDays = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  // Helper function to check if the slot is active and find the activity name for a slot
  const isActiveSlotAndGetActivityName = (day, hour) => {
    const activity = schedule.find(
      (activity) =>
        activity.day === day &&
        hour >= activity.start_hour &&
        hour < activity.end_hour
    );
    const active = activity !== undefined;
    const activityName = active ? activity.name : "";
    return { active, activityName };
  };

  // Render the time slots for each day
  const renderTimeSlots = (day) => {
    return Array.from({ length: 48 }, (_, index) => {
      const hour = index / 2;
      const { active, activityName } = isActiveSlotAndGetActivityName(
        day,
        hour
      );

      return (
        <View
          key={`${day}-${index}`}
          style={[styles.timeSlot, active ? styles.activeTimeSlot : null]}
        >
          {active && <Text style={styles.activityName}>{activityName}</Text>}
        </View>
      );
    });
  };

  // Render the columns for all days
  const renderDayColumns = () => {
    return daysOfWeek.map((day) => (
      <View key={day} style={styles.dayColumn}>
        <Text style={styles.dayHeader}>{shortFormDays[day]}</Text>
        {renderTimeSlots(day)}
      </View>
    ));
  };

  return (
    <ScrollView horizontal style={styles.scrollView}>
      {renderDayColumns()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row", // Lay out children in a row
  },
  dayColumn: {
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    width: 56,
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "bold",
    padding: 4,
    backgroundColor: "#f0f0f0",
  },
  timeSlot: {
    height: 20, // Set the height for each time slot
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  activeTimeSlot: {
    backgroundColor: "#cfe2ff",
  },
  activityName: {
    fontSize: 10,
  },
});

export default ScheduleGrid;
