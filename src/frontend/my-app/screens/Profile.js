import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  cell: {
    flex: 1,
    textAlign: "center",
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
          {content.map((item) => (
            <View style={styles.row} key={item.id}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.sets}</Text>
              <Text style={styles.cell}>{item.reps}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const Profile = ({ navigation, username }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [connections, setConnections] = useState([]);

  const fetchWorkouts = async (username) => {
    const apiUrl = `https://gymconnectbackend.onrender.com/workouts/${username}`;
    try {
      const response = await fetch(apiUrl);
      const responseData = await response.json();
      // Add a unique id to each workout and each exercise so React doesn't complain when rendering a list of workouts
      responseData.map((workout, workoutId) => {
        workout.exercises.map((exercise, exerciseId) => ({
          ...exercise,
          id: exerciseId,
        }));
        return {
          ...workout,
          id: workoutId,
        };
      });
      setWorkouts(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (username) => {
    const apiUrl = `https://gymconnectbackend.onrender.com/user/${username}`;
    try {
      const response = await fetch(apiUrl);
      const responseData = await response.json();
      setUser(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async (username) => {
    const apiUrl = `https://gymconnectbackend.onrender.com/connection/${username}`;

    try {
      const response = await fetch(apiUrl);
      const responseData = await response.json();
      setConnections(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSettings = () => {
    console.log("here");
    // navigation.navigate("Settings");
  };

  useEffect(() => {
    fetchWorkouts(username);
    fetchUser(username);
    fetchConnections(username);
    console.log(user);
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={navigateToSettings}>
        <EvilIcons
          name="gear"
          size={30}
          color="black"
          backgroundColor="transparent"
          style={{ textAlign: "right" }}
        />
      </TouchableOpacity>
      <Text style={{ textAlign: "right" }}>
        {user.first_name} {user.last_name}
      </Text>
      <Text style={{ textAlign: "right" }}>{username}</Text>
      <Text style={{ textAlign: "right" }}>
        {connections.length} Connections
      </Text>
      <Text>Workouts</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          {workouts.map((workout, index) => (
            <ExpandableSection
              key={workout.id}
              title={workout.workout_name}
              content={workout.exercises}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Profile;
