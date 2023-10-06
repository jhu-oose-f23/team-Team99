import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { List, Colors } from "react-native-paper"; // You can use other styling libraries as well

const CreateWorkout = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseRows, setExerciseRows] = useState([]);
  const [workoutNameError, setWorkoutNameError] = useState("");
  const [exerciseError, setExerciseError] = useState("");

  const addExerciseRow = () => {
    const newExercise = {
      name: "",
      sets: "",
      reps: "",
    };
    setExerciseRows([...exerciseRows, newExercise]);
  };

  const updateExercise = (index, field, value) => {
    const updatedExercise = [...exerciseRows];
    updatedExercise[index][field] = value;
    setExerciseRows(updatedExercise);
  };

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
    for (const exercise of exerciseRows) {
      if (!exercise.name.trim() || !exercise.sets.trim() || !exercise.reps.trim()) {
        setExerciseError("All exercise fields must be filled");
        isValid = false;
        break; // Exit the loop after the first error
      } else {
        setExerciseError("");
      }
    }

    // If any validation failed, don't proceed with the save
    if (!isValid) {
      return;
    }

    // Make POST request
    const workout = {
      workout_name: workoutName,
      exercises: exerciseRows,
    };
    const response = await fetch(
      "https://gymconnectbackend.onrender.com/workouts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(workout), // Convert data to JSON format
      }
    );
    const responseData = await response.json();
    console.log(responseData);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Workout Name:</Text>
      <TextInput
        placeholder="Enter workout name"
        value={workoutName}
        onChangeText={(text) => setWorkoutName(text)}
      />
      {workoutNameError && <Text style={{ color: "red" }}>{workoutNameError}</Text>}
      {exerciseError && <Text style={{ color: "red" }}>{exerciseError}</Text>}

      <Button title="Add Exercise Row" onPress={addExerciseRow} />

      <FlatList
        data={exerciseRows}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <TextInput
              style={{ flex: 2, marginRight: 10 }}
              placeholder="Exercise Name"
              value={item.name}
              onChangeText={(text) => updateExercise(index, "name", text)}
            />
            <TextInput
              style={{ flex: 1, marginRight: 10 }}
              placeholder="Sets"
              value={item.sets}
              onChangeText={(text) => updateExercise(index, "sets", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={{ flex: 1 }}
              placeholder="Reps"
              value={item.reps}
              onChangeText={(text) => updateExercise(index, "reps", text)}
              keyboardType="numeric"
            />
          </View>
        )}
      />

      <Button title="Save Workout" onPress={saveWorkout} />
    </View>
  );
};

export default CreateWorkout;
