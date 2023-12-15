import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import {
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { EvilIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import {
  fetchWorkouts,
  fetchUser,
  fetchConnections,
  deleteWorkout,
  postConnectionRequest,
  fetchConnectionRequestSource,
  deleteConnection,
  fetchUserPosts,
  fetchWorkoutDetails,
} from "../api";
import { Avatar } from "react-native-elements";

function convertDateString(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateParts = dateString.split("-");

  const year = dateParts[0];
  const monthIndex = parseInt(dateParts[1], 10) - 1; // months are 0-indexed in JavaScript
  const day = parseInt(dateParts[2], 10);

  const formattedDate = `${months[monthIndex]} ${day}, ${year}`;
  return formattedDate;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a1a", // Dark Grey background
  },
  userInfo: {
    alignItems: "flex-end",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  userDetail: {
    fontSize: 18,
    marginBottom: 5,
    color: "#fff", // White text color
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white", // White text color
  },
  section: {
    marginBottom: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#808080", // Light Grey button background
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#FFD700",
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
    color: "white",
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
    color: "white",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    color: "white", // White text color
  },
  postContainer: {
    backgroundColor: "grey",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#0099ff",
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
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
    color: "#666",
  },
});

// content is a Workout object
const ExpandableSection = ({ title, content, onDelete, allowDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(content);
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
          {/* Only show delete button if allowDelete is true */}
          {allowDelete && (
            <TouchableOpacity
              onPress={() => {
                deleteWorkout(content.id);
                // Callback to remove this workout from Profile's state
                onDelete(content.id);
              }}
              style={{ alignSelf: "flex-end", marginRight: 10 }}
            >
              <FontAwesome name="trash-o" size={30} color="red" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const Profile = ({ navigation, route }) => {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    workouts: [],
    user: {
      first_name: "",
      last_name: "",
    },
    connections: 0,
  });

  const [connectionUsernames, setConnectionUsernames] = useState([]);
  const [posts, setPosts] = useState([]);

  // If username != loggedinUser, this profile is for a different user than the logged in user
  const { username, loggedinUser } = route.params;

  const changeRequestStatus = (profileId) => {
    if (connectionRequests.includes(profileId)) {
      const statusData = deleteConnection(loggedinUser, profileId);

      if (statusData) {
        const newConnectionRequests = connectionRequests.filter(
          (val) => val != profileId
        );
        setConnectionRequests([...newConnectionRequests]);
      }
    } else {
      sendConnectionRequest(profileId);
    }
  };

  const sendConnectionRequest = async (profileId) => {
    await postConnectionRequest(loggedinUser, profileId);
    const fetchedConnectionRequests = await fetchConnectionRequestSource(
      loggedinUser
    );
    if (fetchedConnectionRequests != null) {
      setConnectionRequests(fetchedConnectionRequests);
    }
  };
  const navigateToOwnProfile = () => {
    navigation.navigate("Profile", {
      username: loggedinUser,
      loggedinUser: loggedinUser,
    });
  };

  const navigateToConnections = () => {
    navigation.navigate("Connections");
  };

  const navigateToSettings = () => {
    navigation.navigate("SettingsMain");
  };

  const getButtonLabel = () => {
    if (connectionUsernames.includes(username)) {
      return "Connected";
    } else if (connectionRequests.includes(username)) {
      return "Request Sent";
    } else {
      return "Connect";
    }
  };

  // Function to calculate time difference
  const calculateTimeAgo = (date) => {
    const now = moment();
    const postDate = moment(date);
    const diff = now.diff(postDate, "seconds");

    if (diff < 60) {
      return `${diff} seconds ago`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hours ago`;
    } else {
      return postDate.fromNow();
    }
  };

  // Render exercise table
  const renderExerciseTable = (post) => {
    console.log(post);
    const selectedWorkoutDetails = post.workoutDetails;

    if (!post || post.workout_id === null) {
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

  // useEffect doesn't rerender if you switch to this screen from the nav bar but useFocusEffect does
  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileData = async () => {
        setLoading(true);
        const fetchedConnectionRequests = await fetchConnectionRequestSource(
          loggedinUser
        );
        if (fetchedConnectionRequests != null) {
          setConnectionRequests(fetchedConnectionRequests);
        }

        const [
          workoutsResponse,
          userResponse,
          connectionsResponse,
          loggedInConnectionReponse,
        ] = await Promise.all([
          fetchWorkouts(username),
          fetchUser(username),
          fetchConnections(username),
          fetchConnections(loggedinUser),
        ]);

        const connectionUsernames = setConnectionUsernames(
          loggedInConnectionReponse.map((user) => user.username)
        );

        setProfileData({
          workouts: workoutsResponse,
          user: userResponse,
          connections: connectionsResponse?.length || 0,
        });
        setLoading(false);
      };

      const fetchUserPostData = async () => {
        try {
          const postsResponse = await fetchUserPosts(username);
          const postsWithWorkouts = await Promise.all(
            postsResponse.map(async (post) => {
              if (post.workout_id !== null) {
                const workoutDetails = await fetchWorkoutDetails(
                  post.workout_id
                );
                // console.log(workoutDetails);
                return { ...post, workoutDetails };
              } else {
                return post;
              }
            })
          );
          setPosts(postsWithWorkouts);
        } catch (error) {
          console.error("Error fetching posts:", error.message);
        }
      };

      fetchProfileData();
      fetchUserPostData();
    }, [username])
  );

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={loading}></ActivityIndicator>
      {loading === false && (
        <View>
          <View
            style={{
              ...styles.userInfo,
              flexDirection: "row",
              justifyContent: "space-between", // Align children on opposite ends
              alignItems: "center",
            }}
          >
            <View>
              <View style={{ flexDirection: "row" }}>
                <Avatar
                  rounded
                  title={profileData.user.first_name.charAt(0).toUpperCase()}
                  containerStyle={{
                    backgroundColor: "#FFD700",
                    marginRight: 10,
                    width: 80,
                    height: 80,
                    borderRadius:60,
                  }}
                  titleStyle={{ color: "black",fontSize: 30, fontWeight: "bold" }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={[
                      styles.userDetail,
                      { fontSize: 20, fontWeight: "bold", color: "#FFD700" },
                    ]}
                  >
                    {profileData.user.first_name} {profileData.user.last_name}
                  </Text>
                  <Text style={styles.userDetail}>@{username}</Text>
                  <Text style={styles.userDetail}>
                    {profileData.connections} Connections
                  </Text>
                </View>
              </View>

              {username == loggedinUser && (
                <View style={{ flexDirection: "row", alignItems: "right" }}>
                  <TouchableOpacity
                    onPress={navigateToConnections}
                    style={{ marginLeft: 10 }}
                  >
                    <Ionicons name="ios-people" size={24} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={navigateToSettings}
                    style={{ marginLeft: 10 }}
                  >
                    <Ionicons name="ios-settings" size={24} color="#FFD700" />
                  </TouchableOpacity>
                </View>
              )}
              {username != loggedinUser &&
                !connectionUsernames.includes(username) && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: connectionRequests.includes(username)
                        ? "green"
                        : "#007bff",
                      padding: 5,
                      borderRadius: 5,
                      marginTop: 10,
                    }}
                    onPress={() => changeRequestStatus(username)}
                    // disabled={connectionRequests.includes(username)}
                  >
                    <Text style={{ color: "#fff" }}>{getButtonLabel()}</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Workouts</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <ScrollView>
              {profileData.workouts.map((workout, index) => (
                <ExpandableSection
                  style={styles.dropdown}
                  key={workout.id}
                  title={
                    workout.workout_name.padEnd(50, " ") +
                    convertDateString(workout.day)
                  }
                  content={workout}
                  onDelete={(workoutId) => {
                    setProfileData({
                      ...profileData,
                      workouts: profileData.workouts.filter(
                        (workout) => workout.id != workoutId
                      ),
                    });
                  }}
                  allowDelete={username == loggedinUser}
                />
              ))}
            </ScrollView>
          )}

          {/* Displaying fetched posts */}
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
                color: "white",
              }}
            >
              My Posts
            </Text>
            <FlatList
              data={posts}
              keyExtractor={(post) => post.id.toString()}
              renderItem={({ item: post }) => (
                <View style={styles.postContainer}>
                  {/* User Avatar with First Letter */}
                  <Text style={{ color: "#555" }}>
                    Posted {calculateTimeAgo(post.date_time)}
                  </Text>
                  <View style={styles.divider} />
                  <Text style={{ marginBottom: 10 }}>{post.body}</Text>
                  {post.workoutDetails ? (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 5,
                      }}
                    >
                      {post.workoutDetails.workout_name}
                    </Text>
                  ) : (
                    <></>
                  )}
                  {/* Render exercise table for each post */}
                  {renderExerciseTable(post)}
                </View>
              )}
            />
          </View>

          {username != loggedinUser && (
            <Button title="Back to my profile" onPress={navigateToOwnProfile} />
          )}
        </View>
      )}
    </View>
  );
};

export default Profile;
