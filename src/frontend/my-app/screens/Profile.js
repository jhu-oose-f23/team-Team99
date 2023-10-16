import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { fetchWorkouts, fetchUser, fetchConnections } from "../api";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f8fa",
  },
  userInfo: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  userDetail: {
    fontSize: 18,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0099ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#444",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#666",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});

const ExpandableSection = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.buttonText}>{title}</Text>
        <EvilIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="white"
        />
      </TouchableOpacity>
      {isExpanded && (
        <View>
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

const Profile = ({ navigation, route }) => {
  const { username } = route.params;
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [connections, setConnections] = useState([]);

  // useEffect doesn't rerender if you switch to this screen from the nav bar but useFocusEffect does
  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileData = async () => {
        const workoutsResponse = await fetchWorkouts(username);
        setWorkouts(workoutsResponse);
        const userResponse = await fetchUser(username);
        setUser(userResponse);
        const connectionsResponse = await fetchConnections(username);
        if (connectionsResponse) {
          setConnections(connectionsResponse);
        }
        setLoading(false);
      };
      fetchProfileData();
    }, [username])
  );

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={[styles.userDetail, { fontSize: 20, fontWeight: "bold" }]}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.userDetail}>@{username}</Text>
        <Text style={styles.userDetail}>{connections.length} Connections</Text>
      </View>
      <Text style={styles.sectionTitle}>Workouts</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
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
