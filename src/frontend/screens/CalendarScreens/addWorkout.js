import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import {
//   createWorkout,
  fetchCalendar,
//   fetchWorkouts,
  updateCalendar,
} from "../../api";
import { useFocusEffect } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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

const AddWorkout = ({ route }) => {
  const { username } = route.params;
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseRows, setExerciseRows] = useState([]);
  const [workoutNameError, setWorkoutNameError] = useState("");
  const [exerciseError, setExerciseError] = useState("");
  const [existingWorkouts, setExistingWorkouts] = useState([]);
  const navigation = useNavigation();

  // Days dropdown
  const [workoutDay, setWorkoutDay] = useState("");
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
  const [workoutStartTime, setWorkoutStartTime] = useState(-1);
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [startTimeItems, setStartTimeItems] = useState(times);

  // End time dropdown
  const [workoutEndTime, setWorkoutEndTime] = useState(-1);
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const [endTimeItems, setEndTimeItems] = useState(times);

  const [open, setOpen] = useState([]);
  const [selectedExerciseValue, setSelectedExerciseValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Bench Press", value: "Bench Press" },
    { label: "Bicep Curl", value: "Bicep Curl" },
    { label: "Pull Up", value: "Pull Up" },
    { label: "Chin Up", value: "Chin Up" },
    { label: "Tricep Dip", value: "Tricep Dip" },
    { label: "Seated Row", value: "Seated Row" },
    { label: "Overhead Press", value: "Overhead Press" },
    { label: "Bent over Rows", value: "Bent over Rows" },
    { label: "Squat", value: "Squat" },
    { label: "Romanian Deadlift", value: "Romanian Deadlift" },
    { label: "Skullcrushers", value: "Skullcrushers" },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      const getWorkouts = async () => {
        const workoutsResponse = await fetchWorkouts(username);
        setExistingWorkouts(workoutsResponse);
      };
      getWorkouts();
    }, [])
  );

  const addExerciseRow = () => {
    const newExercise = {
      name: "",
      sets: "",
      reps: "",
    };
    setExerciseRows([...exerciseRows, newExercise]);
  };

  const removeExerciseRow = (index) => {
    const updatedExerciseRows = [...exerciseRows];
    updatedExerciseRows.splice(index, 1);
    setExerciseRows(updatedExerciseRows);
  };

  const updateExercise = (index, field, value) => {
    const updatedExercise = [...exerciseRows];
    updatedExercise[index][field] = value;
    setExerciseRows(updatedExercise);
  };

  useEffect(() => {
    if (exerciseRows.length >= 1 && !exerciseRows.some(isEmptyExercise)) {
      setExerciseError("");
    }
  }, [exerciseRows]);

  const isEmptyExercise = (exercise) =>
    !exercise.name.trim() || !exercise.sets.trim() || !exercise.reps.trim();

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

  const saveWorkout = async () => {
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

    if (
      existingWorkouts.some((workout) => workout.workout_name === workoutName)
    ) {
      setWorkoutNameError("A workout with this name already exists");
      isValid = false;
    }

    // Validate exercise rows
    if (exerciseRows.length === 0) {
      setExerciseError("At least one exercise is required");
      isValid = false;
    } else {
      setExerciseError("");
      for (const exercise of exerciseRows) {
        if (exerciseRows.length >= 1 && exerciseRows.some(isEmptyExercise)) {
          setExerciseError(
            "Can't add another exercise unless all exercises are filled in"
          );
          isValid = false;
        }
      }
    }
    const status = await updateCalendar(username, constructWorkoutCalendar());
    if (status === 404) {
      setWorkoutNameError("A workout already exists for this day and time");
      isValid = false;
    }

    // If any validation failed, don't proceed with the save
    if (!isValid) {
      return;
    }

    // Reset all fields to blank
    setWorkoutName("");
    setExerciseRows([]);
    setWorkoutDay("");
    setWorkoutStartTime(-1);
    setWorkoutEndTime(-1);
    navigation.navigate("Profile", {
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
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
              borderWidth: 1, // specify border width for outlined mode
              flex: 1,
              borderColor: "white",
            }}
            mode="outlined"
            placeholder="Workout Name"
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
              color: "#C7C7CD",
              marginBottom: 8,
            }}
            style={{
              borderWidth: 0,
            }}
            dropDownContainerStyle={{
              borderWidth: 0,
              maxHeight: 2000,
            }}
            containerStyle={{
              maxHeight: 2000,
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
            placeholder="Start Time"
            placeholderStyle={{
              color: "#C7C7CD",
              marginBottom: 8,
            }}
            style={{
              borderWidth: 0,
            }}
            dropDownContainerStyle={{
              borderWidth: 0,
            }}
            containerStyle={{
              maxHeight: 2000,
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
            }}
            dropDownContainerStyle={{
              borderWidth: 0,
            }}
            containerStyle={{
              maxHeight: 2000,
            }}
          />
        </View>
      </View>
      {workoutNameError && (
        <Text style={styles.errorText}>{workoutNameError}</Text>
      )}
      {exerciseError && <Text style={styles.errorText}>{exerciseError}</Text>}

      <Button title="Add Exercise" onPress={addExerciseRow} />

      <FlatList
        data={exerciseRows}
        keyExtractor={(item, index) => index.toString()}
        CellRendererComponent={({ children, index, style, ...props }) => {
          return (
            <View
              style={[style, { zIndex: -1 * index }]}
              index={index}
              {...props}
            >
              {children}
            </View>
          );
        }}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              marginBottom: 15,
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 30,
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.input,
                // { flex: 2, minHeight: open[index] ? 250 : 0 },
                { flex: 2 },
              ]}
            >
              <DropDownPicker
                open={open[index]}
                listMode="SCROLLVIEW"
                value={item.name}
                items={items}
                setOpen={(o) => {
                  const updatedOpen = [...open];
                  // Check if open[index] is defined
                  if (open.length > index) {
                    updatedOpen[index] = o;
                  } else {
                    updatedOpen.push(o);
                  }
                  setOpen(updatedOpen);
                }}
                onOpen={() => {
                  // Close all other dropdowns
                  const updatedOpen = [...open];
                  updatedOpen.forEach((o, i) => {
                    updatedOpen[i] = false;
                  });
                  updatedOpen[index] = true;
                  setOpen(updatedOpen);
                }}
                setValue={(v) => updateExercise(index, "name", v())}
                placeholder="Exercise"
                placeholderStyle={{
                  color: "#C7C7CD",
                  marginBottom: 8,
                }}
                style={{
                  borderWidth: 0,
                }}
                dropDownContainerStyle={{
                  borderWidth: 0,
                  maxHeight: 2000,
                }}
                containerStyle={{
                  maxHeight: 2000,
                }}
              />
            </View>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              mode="outlined"
              placeholder="Weight"
              value={item.weight}
              onChangeText={(text) => updateExercise(index, "weight", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              mode="outlined"
              placeholder="Sets"
              value={item.sets}
              onChangeText={(text) => updateExercise(index, "sets", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              mode="outlined"
              placeholder="Reps"
              value={item.reps}
              onChangeText={(text) => updateExercise(index, "reps", text)}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => removeExerciseRow(index)}>
              <Text style={styles.removeIcon}>x</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Save Workout" onPress={saveWorkout} />
    </View>
  );
};

export default AddWorkout;

