import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { createPost, fetchWorkouts } from "../api";

const CreatePost = ({ route }) => {
  const [postBody, setPostBody] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutOptions, setShowWorkoutOptions] = useState(false);
  const [selectedWorkoutDetails, setSelectedWorkoutDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  const username = route.params.username;

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const fetchedWorkouts = await fetchWorkouts(username);
        setWorkouts(fetchedWorkouts);
      } catch (error) {
        console.error("Error fetching workout data:", error.message);
      }
    };

    fetchWorkoutData();
  }, [username]);

  const handleCreatePost = async () => {
    try {
      setIsLoading(true);
      print(selectedWorkout);
      const data = await createPost(
        username,
        postBody,
        selectedWorkout ? selectedWorkout.id : -1
      );
      console.log("Post created:", data);
    } catch (error) {
      console.error("Error creating post:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkoutOptions = () => {
    setShowWorkoutOptions(!showWorkoutOptions);
  };

  const selectWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutOptions(false);
    setSelectedWorkoutDetails(workout);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setShowWorkoutOptions(false);
  };

  const renderExerciseTable = () => {
    if (!selectedWorkoutDetails || selectedWorkoutDetails.id === -1) {
      return null; // Don't show the table for "No Selection"
    }

    return (
      <FlatList
        data={selectedWorkoutDetails.exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseRow}>
            <Text style={styles.exerciseCell}>{item.name}</Text>
            <Text style={styles.exerciseCell}>{item.sets}</Text>
            <Text style={styles.exerciseCell}>{item.reps}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Exercise</Text>
            <Text style={styles.headerCell}>Sets</Text>
            <Text style={styles.headerCell}>Reps</Text>
          </View>
        )}
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your post..."
          placeholderTextColor="white"
          onChangeText={(text) => setPostBody(text)}
          value={postBody}
          multiline
        />
        <TouchableOpacity
          onPress={toggleWorkoutOptions}
          style={styles.workoutBox}
        >
          <Text style={styles.workoutText}>
            {selectedWorkout
              ? selectedWorkout.workout_name
              : "Select a workout"}
          </Text>
        </TouchableOpacity>
        {showWorkoutOptions && (
          <View style={styles.workoutOptionsContainer}>
            {[
              { workout_name: "No Selection", exercises: [], id: -1 },
              ...workouts,
            ].map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={styles.workoutOption}
                onPress={() => selectWorkout(workout)}
              >
                <Text style={styles.workoutOptionText}>
                  {workout.workout_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {renderExerciseTable()}
        <Button
          title="Create Post"
          onPress={handleCreatePost}
          disabled={isLoading} // Disable the button when loading
          color="#FFD700" // Change the button color
        />
        {isLoading && <ActivityIndicator size="small" color="#007bff" />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
    backgroundColor: "#1a1a1a",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    color: "white", // Text color
    backgroundColor: "#808080", // Light grey background
  },
  workoutBox: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    paddingLeft: 8,
    marginBottom: 16,
    backgroundColor: "#808080", // Light grey background
  },
  workoutText: {
    color: "white", // White text
  },
  workoutOptionsContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    backgroundColor: "#808080",
  },
  workoutOption: {
    padding: 8,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  workoutOptionText: {
    color: "white",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#FFD700",
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  exerciseCell: {
    flex: 1,
    textAlign: "center",
    color: "white",
  },
});

export default CreatePost;
