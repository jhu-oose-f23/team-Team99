import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createWorkout, fetchWorkouts } from "../api";
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
      // Initialize with one empty exercise row when the component loads
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

    // If any validation failed, don't proceed with the save
    if (!isValid) {
      return;
    }
    const workout = {
      user: username,
      workout_name: workoutName,
      exercises: exerciseRows,
    };
    await createWorkout(workout);

    // Reset all fields to blank
    setWorkoutName("");
    setExerciseRows([]);
    navigation.navigate("Profile", {
      username: username,
      loggedinUser: username,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          margin: 0,
          marginBottom: 5,
          backgroundColor: "#fff",
          height: 50,
          padding: 10,
        }}
        mode="outlined"
        placeholder="Workout name"
        value={workoutName}
        onChangeText={(text) => setWorkoutName(text)}
      />
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
              borderRadius: 5,
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
                }}
              />
            </View>
            <TextInput
              style={[styles.input, { flex: 2, marginRight: 10 }]}
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

export default CreateWorkout;
