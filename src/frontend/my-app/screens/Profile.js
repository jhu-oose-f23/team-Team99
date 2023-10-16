import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchWorkouts,
  fetchUser,
  fetchConnections,
  deleteWorkout,
} from "../api";

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

// content is a Workout object
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
          {content.exercises.map((item) => (
            <View style={styles.row} key={item.id}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.sets}</Text>
              <Text style={styles.cell}>{item.reps}</Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => deleteWorkout(content.id)}
            style={{ alignSelf: "flex-end", marginRight: 10 }}
          >
            <FontAwesome name="trash-o" size={30} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Profile = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    workouts: [],
    user: {
      first_name: "",
      last_name: "",
    },
    connections: 0,
    loading: true,
  });

  // If username != loggedinUser, this profile is for a different user than the logged in user
  const { username, loggedinUser} = route.params;

  const navigateToOwnProfile = () => {
    navigation.navigate("Profile", {
      username: loggedinUser,
      loggedinUser: loggedinUser,
    });
  };

  // useEffect doesn't rerender if you switch to this screen from the nav bar but useFocusEffect does
  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileData = async () => {
        const workoutsResponse = await fetchWorkouts(username);
        console.log(workoutsResponse);
        const userResponse = await fetchUser(username);
        const connectionsResponse = await fetchConnections(username);
        setProfileData({
          workouts: workoutsResponse,
          user: userResponse,
          connections: connectionsResponse?.length || 0,
          loading: false,
        });
      };
      fetchProfileData();
    }, [username])
  );

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={[styles.userDetail, { fontSize: 20, fontWeight: "bold" }]}>
          {profileData.user.first_name} {profileData.user.last_name}
        </Text>
        <Text style={styles.userDetail}>@{username}</Text>
        <Text style={styles.userDetail}>
          {profileData.connections} Connections
        </Text>
      </View>
      <Text style={styles.sectionTitle}>Workouts</Text>
      {profileData.loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView>
          {profileData.workouts.map((workout, index) => (
            <ExpandableSection
              key={workout.id}
              title={workout.workout_name}
              content={workout}
            />
          ))}
        </ScrollView>
      )}
      {username != loggedinUser && (
        <Button title="Back to my profile" onPress={navigateToOwnProfile} />
      )}
    </View>
  );
};

export default Profile;
