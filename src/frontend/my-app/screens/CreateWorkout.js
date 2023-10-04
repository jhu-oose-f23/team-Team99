import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { List, Colors } from "react-native-paper"; // You can use other styling libraries as well
import { ToastProvider, useToast } from "../components/CreateWorkoutToast";

const CreateWorkout = ({navigation}) => {
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseRows, setExerciseRows] = useState([]);
  const showToast = useToast();

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
    navigation.popToTop();

    showToast({
      type: 'success',
      text1: 'Workout Session Saved Successfully!',
      visibilityTime: 2000, // Adjust the duration as needed (1000ms for 1 second)
    });

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
