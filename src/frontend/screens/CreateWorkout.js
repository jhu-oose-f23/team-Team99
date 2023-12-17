import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { createWorkout, fetchWorkouts, updateCalendar } from "../api";
import { useFocusEffect } from "@react-navigation/native";
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
    backgroundColor: "#808080",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  input: {
    margin: 0,
    marginBottom: 5,
    backgroundColor: "#808080",
    height: 40,
    color: "white", // White text color
  },
  removeIcon: {
    color: "red",
    fontSize: 24,
    marginLeft: 10,
  },
});

const CreateWorkout = ({ route }) => {
  const { username } = route.params;
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseRows, setExerciseRows] = useState([]);
  const [workoutNameError, setWorkoutNameError] = useState("");
  const [exerciseError, setExerciseError] = useState("");
  const [existingWorkouts, setExistingWorkouts] = useState([]);
  const navigation = useNavigation();

  // Days dropdown
  const [workoutDay, setWorkoutDay] = useState(new Date());
  const [open, setOpen] = useState(false);
  // Exercises
  const [exercisesOpen, setExercisesOpen] = useState([]);
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
  const [loading, setLoading] = useState(false);

  const addExerciseRow = () => {
    const newExercise = {
      name: "",
      sets: "",
      reps: "",
      weight: "",
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
    !exercise.name.trim() ||
    !exercise.sets.trim() ||
    !exercise.weight.trim() ||
    !exercise.reps.trim();

  const saveWorkout = async () => {
    // Validate workout name
    if (!workoutName.trim()) {
      setWorkoutNameError("Workout name is required");
      return;
    }
    setWorkoutNameError("");

    let dateFormatted = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(workoutDay);

    if (
      existingWorkouts.some(
        (workout) =>
          workout.workout_name === workoutName && workout.day === dateFormatted
      )
    ) {
      setWorkoutNameError("A workout with this name and date already exists");
      return;
    }

    // Validate exercise rows
    if (exerciseRows.length === 0) {
      setExerciseError("At least one exercise is required");
      return;
    }
    setExerciseError("");
    if (exerciseRows.length >= 1 && exerciseRows.some(isEmptyExercise)) {
      setExerciseError("Can't have an empty exercise");
      return
    }

    const workout = {
      user: username,
      workout_name: workoutName,
      exercises: exerciseRows,
      day: dateFormatted,
    };
    setLoading(true);
    await createWorkout(workout);
    setLoading(false);

    // Reset all fields to blank
    setWorkoutName("");
    setExerciseRows([]);
    setWorkoutDay(new Date());
    navigation.navigate("Profile", {
      username: username,
      loggedinUser: username,
    });
  };
  console.log(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(workoutDay)
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Workout",
      headerStyle: {
        backgroundColor: "#1a1a1a", // Set your desired background color
      },
      headerTintColor: "#FFD700", // Set text color
    });
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            zIndex: 100,
          }}
        >
          <View style={{ flex: 1, height: 60 }}>
            <Text style={{ marginRight: 50, color: "white" }}>Name</Text>
            <TextInput
              style={{
                margin: 0,
                backgroundColor: "#808080",
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                flex: 1,
                height: 100,
                //borderColor: "white",
                color: "white", // White text color
              }}
              mode="outlined"
              placeholder="Workout Name"
              placeholderTextColor="#C7C7CD"
              value={workoutName}
              onChangeText={(text) => setWorkoutName(text)}
            />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ marginRight: 60, color: "white" }}>Date</Text>
            <View style={{ borderRadius: 10, overflow: "hidden" }}>
              <DateTimePicker
                testID="dateTimePicker"
                value={workoutDay}
                maximumDate={new Date()}
                mode="date"
                display="default"
                placeholderText="Select Date"
                onChange={(event, selectedDate) => {
                  setOpen(false);
                  setWorkoutDay(selectedDate);
                }}
                style={{
                  alignContent: "center",
                  alignSelf: "center",
                  backgroundColor: "#808080", // Light grey background
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            zIndex: 50,
            marginTop: 5,
          }}
        ></View>
        {workoutNameError && (
          <Text style={styles.errorText}>{workoutNameError}</Text>
        )}

        {exerciseError && <Text style={styles.errorText}>{exerciseError}</Text>}

        <Button title="Add Exercise" onPress={addExerciseRow} color="#FFD700" />
        <View>
          {exerciseRows.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                marginBottom: 15,
                backgroundColor: "#808080",
                padding: 10,
                borderRadius: 30,
                alignItems: "center",
                zIndex: -1 * index,
              }}
            >
              <View style={[styles.input, { flex: 2 }]}>
                <DropDownPicker
                  open={exercisesOpen[index]}
                  listMode="SCROLLVIEW"
                  value={item.name}
                  items={items}
                  setOpen={(o) => {
                    const updatedOpen = [...exercisesOpen];
                    if (exercisesOpen.length > index) {
                      updatedOpen[index] = o;
                    } else {
                      updatedOpen.push(o);
                    }
                    setExercisesOpen(updatedOpen);
                  }}
                  onOpen={() => {
                    const updatedOpen = [...exercisesOpen];
                    updatedOpen.forEach((o, i) => {
                      updatedOpen[i] = false;
                    });
                    updatedOpen[index] = true;
                    setExercisesOpen(updatedOpen);
                  }}
                  setValue={(v) => updateExercise(index, "name", v())}
                  placeholder="Exercise"
                  placeholderStyle={{
                    color: "#C7C7CD",
                    marginBottom: 8,
                  }}
                  style={{
                    borderWidth: 0,
                    backgroundColor: "#808080", // Light grey background
                  }}
                  dropDownContainerStyle={{
                    borderWidth: 0,
                    maxHeight: 2000,
                    backgroundColor: "#808080", // Light grey background
                  }}
                  containerStyle={{
                    maxHeight: 2000,
                  }}
                  listItemLabelStyle={{
                    color: "white", // Text color of the dropdown items
                  }}
                  labelStyle={{
                    color: "white", // Text color of the label
                  }}
                />
              </View>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                mode="outlined"
                placeholder="Weight"
                placeholderTextColor="#C7C7CD"
                value={item.weight}
                onChangeText={(text) => updateExercise(index, "weight", text)}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                mode="outlined"
                placeholder="Sets"
                placeholderTextColor="#C7C7CD"
                value={item.sets}
                onChangeText={(text) => updateExercise(index, "sets", text)}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                mode="outlined"
                placeholder="Reps"
                placeholderTextColor="#C7C7CD"
                value={item.reps}
                onChangeText={(text) => updateExercise(index, "reps", text)}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => removeExerciseRow(index)}>
                <Text style={styles.removeIcon}>x</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Button
          title="Save Workout"
          onPress={saveWorkout}
          color="#FFD700"
          disabled={loading}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateWorkout;
