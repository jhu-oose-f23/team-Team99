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
import { List, Colors } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createWorkout } from "../api";

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
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize with one empty exercise row when the component loads
    addExerciseRow();
  }, []);

  const addExerciseRow = () => {
    if (exerciseRows.length >= 1 && exerciseRows.some(isEmptyExercise)) {
      setExerciseError(
        "Can't add another exercise unless all exercises are filled in"
      );
      return;
    }
    setExerciseError("");
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

    // Validate exercise rows
    if (exerciseRows.length === 0) {
      setExerciseError("At least one exercise is required");
      isValid = false;
    } else {
      setExerciseError("");
      for (const exercise of exerciseRows) {
        if (isEmptyExercise(exercise)) {
          setExerciseError("All exercise fields must be filled");
          isValid = false;
          break; // Exit the loop after the first error
        } else {
          setExerciseError("");
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
        style={styles.input}
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
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 2, marginRight: 10 }]}
              mode="outlined"
              placeholder="Exercise Name"
              value={item.name}
              onChangeText={(text) => updateExercise(index, "name", text)}
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
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Save Workout" onPress={saveWorkout} />
    </View>
  );
};

export default CreateWorkout;
