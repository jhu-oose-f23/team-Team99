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
import {
  createWorkout,
  fetchCalendar,
  fetchWorkouts,
  updateCalendar,
} from "../api";
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
    // Input validation
    let isValid = true;

    // Validate workout name
    if (!workoutName.trim()) {
      setWorkoutNameError("Workout name is required");
      isValid = false;
    } else {
      setWorkoutNameError("");
    }

    let todaysDate = new Date().toISOString().slice(0, 10);
    if (
      existingWorkouts.some(
        (workout) =>
          workout.workout_name === workoutName && workout.day === todaysDate
      )
    ) {
      setWorkoutNameError("A workout with this name and date already exists");
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
          setExerciseError("Can't have an empty exercise");
          isValid = false;
        }
      }
    }
    // const status = await updateCalendar(username, constructWorkoutCalendar());
    // if (status === 404) {
    //   setWorkoutNameError("A workout already exists for this day and time");
    //   isValid = false;
    // }

    // If any validation failed, don't proceed with the save
    if (!isValid) {
      return;
    }
    const workout = {
      user: username,
      workout_name: workoutName,
      exercises: exerciseRows,
      day: workoutDay.toISOString().slice(0, 10),
    };
    await createWorkout(workout);

    // Reset all fields to blank
    setWorkoutName("");
    setExerciseRows([]);
    setWorkoutDay(new Date());
    navigation.navigate("Profile", {
      username: username,
      loggedinUser: username,
    });
  };
  console.log(workoutDay);

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
            <Text style={{ marginRight: 50 }}>Name</Text>
            <TextInput
              style={{
                margin: 0,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
                borderWidth: 1, // specify border width for outlined mode
                flex: 1,
                height: 100,
                borderColor: "white",
              }}
              mode="outlined"
              placeholder="Workout Name"
              value={workoutName}
              onChangeText={(text) => setWorkoutName(text)}
            />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ marginRight: 60 }}>Date</Text>
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
              style={{ alignContent: "center", alignSelf: "center" }}
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
        ></View>
        {workoutNameError && (
          <Text style={styles.errorText}>{workoutNameError}</Text>
        )}
        {exerciseError && <Text style={styles.errorText}>{exerciseError}</Text>}

        <Button title="Add Exercise" onPress={addExerciseRow} />
        <View>
          {exerciseRows.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                marginBottom: 15,
                backgroundColor: "#fff",
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
                    // Check if exercisesOpen[index] is defined
                    if (exercisesOpen.length > index) {
                      updatedOpen[index] = o;
                    } else {
                      updatedOpen.push(o);
                    }
                    setExercisesOpen(updatedOpen);
                  }}
                  onOpen={() => {
                    // Close all other dropdowns
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
          ))}
        </View>

        <Button title="Save Workout" onPress={saveWorkout} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateWorkout;
