import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { TouchableOpacity, FlatList, StyleSheet } from "react-native";

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
  tableContainer: {
    // Style for the table container
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

const ExpandableSection = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text>{title}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Exercise</Text>
            <Text style={styles.tableHeaderCell}>Sets</Text>
            <Text style={styles.tableHeaderCell}>Reps</Text>
          </View>
          <FlatList
            data={content}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.sets}</Text>
                <Text style={styles.cell}>{item.reps}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const WorkoutDisplay = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  
  return (
    <View>
      <Text>My Workouts</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {data.map((workout, index) => (
            <ExpandableSection
              key={index}
              title={workout.workout_name}
              content={workout.exercises}
            />
          ))}
        </>
      )}
      <Button
        title="Go back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default WorkoutDisplay;