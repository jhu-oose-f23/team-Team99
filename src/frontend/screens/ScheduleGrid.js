import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

const ScheduleGrid = ({ schedule, username }) => {
  // Define all days of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Helper function to check if the slot is active
  const isActiveSlot = (day, hour) => {
    return schedule.some(
      (activity) =>
        activity.day === day &&
        hour >= activity.start_hour &&
        hour < activity.end_hour
    );
  };

  // Helper function to find the activity name for a slot
  const getActivityName = (day, hour) => {
    const activity = schedule.find(
      (activity) =>
        activity.day === day &&
        hour >= activity.start_hour &&
        hour < activity.end_hour
    );
    return activity ? activity.name : "";
  };

  // Render the time slots for each day
  const renderTimeSlots = (day) => {
    return Array.from({ length: 48 }, (_, index) => {
      const hour = index / 2;
      const active = isActiveSlot(day, hour);
      const activityName = getActivityName(day, hour);

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
        <Text style={styles.dayHeader}>{day}</Text>
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
    backgroundColor: "#fff",
  },
  dayColumn: {
    borderWidth: 1,
    borderColor: "#ddd",
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
