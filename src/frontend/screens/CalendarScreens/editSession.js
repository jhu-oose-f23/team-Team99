import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import {
    deleteCalendar,
  updateCalendar,
} from "../../api";
import DropDownPicker from "react-native-dropdown-picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1a1a1a",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  input: {
    margin: 0,
    marginBottom: 5,
    backgroundColor: "#fff",
    height: 40,
  },
  removeIcon: {
    color: "red",
    fontSize: 24,
    marginLeft: 10,
  },
});

const times = [
  { label: "12:00 AM", value: 0 },
  { label: "12:30 AM", value: 0.5 },
  { label: "1:00 AM", value: 1 },
  { label: "1:30 AM", value: 1.5 },
  { label: "2:00 AM", value: 2 },
  { label: "2:30 AM", value: 2.5 },
  { label: "3:00 AM", value: 3 },
  { label: "3:30 AM", value: 3.5 },
  { label: "4:00 AM", value: 4 },
  { label: "4:30 AM", value: 4.5 },
  { label: "5:00 AM", value: 5 },
  { label: "5:30 AM", value: 5.5 },
  { label: "6:00 AM", value: 6 },
  { label: "6:30 AM", value: 6.5 },
  { label: "7:00 AM", value: 7 },
  { label: "7:30 AM", value: 7.5 },
  { label: "8:00 AM", value: 8 },
  { label: "8:30 AM", value: 8.5 },
  { label: "9:00 AM", value: 9 },
  { label: "9:30 AM", value: 9.5 },
  { label: "10:00 AM", value: 10 },
  { label: "10:30 AM", value: 10.5 },
  { label: "11:00 AM", value: 11 },
  { label: "11:30 AM", value: 11.5 },
  { label: "12:00 PM", value: 12 },
  { label: "12:30 PM", value: 12.5 },
  { label: "1:00 PM", value: 13 },
  { label: "1:30 PM", value: 13.5 },
  { label: "2:00 PM", value: 14 },
  { label: "2:30 PM", value: 14.5 },
  { label: "3:00 PM", value: 15 },
  { label: "3:30 PM", value: 15.5 },
  { label: "4:00 PM", value: 16 },
  { label: "4:30 PM", value: 16.5 },
  { label: "5:00 PM", value: 17 },
  { label: "5:30 PM", value: 17.5 },
  { label: "6:00 PM", value: 18 },
  { label: "6:30 PM", value: 18.5 },
  { label: "7:00 PM", value: 19 },
  { label: "7:30 PM", value: 19.5 },
  { label: "8:00 PM", value: 20 },
  { label: "8:30 PM", value: 20.5 },
  { label: "9:00 PM", value: 21 },
  { label: "9:30 PM", value: 21.5 },
  { label: "10:00 PM", value: 22 },
  { label: "10:30 PM", value: 22.5 },
  { label: "11:00 PM", value: 23 },
  { label: "11:30 PM", value: 23.5 },
];

const EditSession = ({ route, navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#1a1a1a", // Set header background color
      },
      headerTintColor: "#FFD700", // Set text color
    });
  }, [navigation]);

  const { username, session } = route.params;
  const [workoutName, setWorkoutName] = useState(session?.name);
  const [workoutNameError, setWorkoutNameError] = useState("");
  const [exerciseError, setExerciseError] = useState("");
  const initialSession = session;
  

  // Days dropdown
  const [workoutDay, setWorkoutDay] = useState(session?.day);
  const [dayOpen, setDayOpen] = useState(false);
  const [daysItems, setDaysItems] = useState([
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ]);

  // Start time dropdown
  const [workoutStartTime, setWorkoutStartTime] = useState(session?.start_hour);
  const [startTimeOpen, setStartTimeOpen] = useState(false);

  // End time dropdown
  const [workoutEndTime, setWorkoutEndTime] = useState(session?.end_hour);
  const [endTimeOpen, setEndTimeOpen] = useState(false);

  const constructWorkoutCalendar = () => ({
    schedule: [
      {
        day: workoutDay,
        start_hour: workoutStartTime,
        end_hour: workoutEndTime,
        name: workoutName,
      },
    ],
    username,
  });


  const EditWorkout = async () => {
    // Input validation
    let isValid = true;

    // Validate workout name
    if (!workoutName.trim()) {
      setWorkoutNameError("Workout name is required");
      isValid = false;
    } else {
      setWorkoutNameError("");
    }

    // Check if start time is before end time
    if (workoutStartTime >= workoutEndTime) {
      setWorkoutNameError("Start time must be before end time");
      isValid = false;
    }

    // Cannot add time if day is not filled in
    if (
      !workoutDay.trim() &&
      (workoutStartTime != -1 || workoutEndTime != -1)
    ) {
      setWorkoutNameError("Must select a day if adding a time");
      isValid = false;
    }

    // console.log("The username is", username)
    const status1 = await deleteCalendar(username, initialSession)

    
    const status = await updateCalendar(username, constructWorkoutCalendar());
    if (status === 404) {
      setWorkoutNameError("A workout already exists for this day and time");
      isValid = false;
    }

    // If any validation failed, don't proceed with the save
    if (!isValid) {
      return;
    }

    navigation.navigate("Calendar ", {
      username: username,
      loggedinUser: username,
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          zIndex: 100,
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            style={{
              margin: 0,
              padding: 10,
              borderRadius: 10,
              flex: 1,
              backgroundColor: "#808080",
              color: "white",
            }}
            mode="outlined"
            placeholder={`Workout Name`} 
            value={workoutName}
            onChangeText={(text) => setWorkoutName(text)}
          />
        </View>

        <View style={{ flex: 1 }}>
          <DropDownPicker
            open={dayOpen}
            listMode="SCROLLVIEW"
            value={workoutDay}
            items={daysItems}
            setOpen={setDayOpen}
            setValue={(v) => setWorkoutDay(v())}
            placeholder="Day"
            placeholderStyle={{
              marginBottom: 8,
              color: "#C7C7CD",
            }}
            style={{
              borderWidth: 0,
              backgroundColor: "#808080",
            }}
            dropDownContainerStyle={{
              borderWidth: 0,
              maxHeight: 2000,
              backgroundColor: "#808080",
            }}
            containerStyle={{
              maxHeight: 2000,
            }}
            textStyle={{
              color: "white",
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          zIndex: 50,
          marginTop: 5,
        }}
      >
        <View style={{ flex: 1 }}>
          <DropDownPicker
            open={startTimeOpen}
            listMode="SCROLLVIEW"
            value={workoutStartTime}
            items={times}
            setOpen={setStartTimeOpen}
            setValue={(v) => setWorkoutStartTime(v())}
            placeholder= {() => session.start_hour}
            placeholderStyle={{
              color: "#C7C7CD",
              marginBottom: 8,
            }}
            style={{
              borderWidth: 0,
              backgroundColor: "#808080",
            }}
            dropDownContainerStyle={{
              borderWidth: 0,
              backgroundColor: "#808080",
            }}
            containerStyle={{
              maxHeight: 2000,
            }}
            textStyle={{
              color: "white",
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <DropDownPicker
            open={endTimeOpen}
            listMode="SCROLLVIEW"
            value={workoutEndTime}
            items={times}
            setOpen={setEndTimeOpen}
            setValue={(v) => setWorkoutEndTime(v())}
            placeholder="End Time"
            placeholderStyle={{
              color: "#C7C7CD",
              marginBottom: 8,
            }}
            style={{
              borderWidth: 0,
              backgroundColor: "#808080",
            }}
            dropDownContainerStyle={{
              borderWidth: 0,
              backgroundColor: "#808080",
            }}
            containerStyle={{
              maxHeight: 2000,
            }}
            textStyle={{
              color: "white",
            }}
          />
        </View>
      </View>
      {workoutNameError && (
        <Text style={styles.errorText}>{workoutNameError}</Text>
      )}
      {exerciseError && <Text style={styles.errorText}>{exerciseError}</Text>}

      <Button title="Edit Workout" color="#FFD700" onPress={EditWorkout} />
    </View>
  );
};

export default EditSession;
