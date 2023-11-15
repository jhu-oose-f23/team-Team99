import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";

const { width: screenWidth } = Dimensions.get("window"); // Get the width of the screen

const ScheduleGrid = ({ schedule }) => {
  const daysOfWeek = {
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
    return Array.from({ length: 49 }, (_, index) => {
      const hour = Math.floor(index / 2);
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

  // Render the time labels on the left side
  const renderTimeLabels = () => {
    return Array.from({ length: 49 }, (_, index) => {
      const hour = Math.floor(index / 2);
      const minutes = index % 2 === 0 ? "00" : "30";
      return (
        <View key={index} style={styles.timeLabelContainer}>
          <Text style={styles.timeLabel}>{`${hour}:${minutes}`}</Text>
        </View>
      );
    });
  };

  // Render the columns for all days
  const renderDayColumns = () => {
    return Object.entries(daysOfWeek).map(([day, dayShort]) => (
      <View key={day} style={styles.dayColumn}>
        <Text style={styles.dayHeader}>{dayShort}</Text>
        {renderTimeSlots(day)}
      </View>
    ));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.timeColumn}>{renderTimeLabels()}</View>
        <View style={styles.scrollView}>{renderDayColumns()}</View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  scrollView: {
    backgroundColor: "#fff",
    width: screenWidth - 50, // Subtract the width of the time column
    flexDirection: "row",
  },
  timeColumn: {
    paddingTop: 18, // Align with the day headers
  },
  dayColumn: {
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    width: (screenWidth - 50) / 7, // Adjust the width for seven days minus the time column
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
  timeLabelContainer: {
    height: 20, // Match the height of the time slots
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 10, // Right padding to align text with the slots
  },
  timeLabel: {
    fontSize: 10, // Match the font size of the time slots for consistency
  },
  columnContainer: {
    flexDirection: "row",
  },
});

export default ScheduleGrid;
