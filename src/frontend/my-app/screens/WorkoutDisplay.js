import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { TouchableOpacity, StyleSheet } from "react-native";

const sections = [
  { title: "Push", content: "This is the content for section 1." },
  { title: "Pull", content: "This is the content for section 2." },
  { title: "Legs", content: "This is the content for section 3." },
];

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  section: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 5,
  },
});

const ExpandableSection = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  console.log(content)

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text>{title}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.dropdown}>
          {content.map((exercise, index) => {
            <>
              <Text>{exercise.name}</Text>
              <Text>{exercise.sets}</Text>
              <Text>{exercise.reps}</Text>
            </>
          })}
        </View>
      )}
    </View>
  );
};


const WorkoutDisplay = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define the URL you want to fetch data from
    const apiUrl = 'https://gymconnectbackend.onrender.com/workouts';

    // Make a GET request to the URL
    fetch(apiUrl)
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);
  // console.log(data[0].exercises[0].name)
  return (
    
    <View>
      <Text>My Workouts</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          {data.map((workout, index) => (
            <ExpandableSection
              key={index}
              title={workout.workout_name}
              content={workout.exercises}
            />
          ))}
        </ScrollView>
      )}
      <Button
        title="Go back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default WorkoutDisplay;