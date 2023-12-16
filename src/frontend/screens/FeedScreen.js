import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchRecommendations,
  postConnectionRequest,
  fetchConnectionRequestSource,
  deleteConnection,
  fetchPostsFeed,
  fetchWorkoutDetails,
} from "../api";
import { Avatar } from "react-native-elements";
import moment from "moment";

const FeedScreen = ({ navigation, route }) => {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    recommendations: [],
  });
  const [posts, setPosts] = useState([]);

  const username = route.params.username;

  const resetToFeed = () => {
    setIsSearchActive(false);
    setSearchQuery("");
  };

  const navigateToProfile = (navigateToUsername) => {
    navigation.navigate("Profile", {
      username: navigateToUsername,
      loggedinUser: username,
    });
  };

  // send a connection request if none exists. Else delete the active connection request

  const changeRequestStatus = (profileId) => {
    if (connectionRequests.includes(profileId)) {
      const statusData = deleteConnection(username, profileId)

      if (statusData) {
        const newConnectionRequests = connectionRequests.filter(val => val != profileId)
        setConnectionRequests([...newConnectionRequests])
        console.log("Retracting connection succeeded")
      }      
    }

    else {
      sendConnectionRequest(profileId);
    }
  }

  const sendConnectionRequest = async (profileId) => {
    await postConnectionRequest(username, profileId);
    setConnectionRequests([...connectionRequests, profileId]);
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

  // Get Search Results
  useEffect(() => {
    fetch("https://gymconnectbackend.onrender.com/user")
      .then((response) => response.json())
      .then((responseData) => {
        // Map the response data to combine the first and last names
        const mappedUsers = responseData.map((user) => ({
          ...user,
          name: `${user.first_name} ${user.last_name}`,
        }));
        setUsers(mappedUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to fetch posts with workout details
  const fetchPosts = async () => {
    try {
      const postsResponse = await fetchPostsFeed(username);
      const postsWithWorkouts = await Promise.all(
        postsResponse.map(async (post) => {
          if (post.workout_id !== null) {
            const workoutDetails = await fetchWorkoutDetails(post.workout_id);
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

  // Get Recommendations and Posts
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await fetchPosts();
        const fetchedConnectionRequests = await fetchConnectionRequestSource(
          username
        );
        if (fetchedConnectionRequests != null) {
          setConnectionRequests(fetchedConnectionRequests);
        }
        const recommendationsResponse = await fetchRecommendations(username);
        setUserData({
          recommendations: recommendationsResponse,
        });
      };
      fetchData();
    }, [username])
  );

  // Render exercise table
  const renderExerciseTable = (post) => {
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

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      {isSearchActive && (
        <TouchableOpacity style={styles.backButton} onPress={resetToFeed}>
          <Text style={styles.backButtonText}>Back to Feed</Text>
        </TouchableOpacity>
      )}
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search..."
        onFocus={() => setIsSearchActive(true)}
        onBlur={() => setIsSearchActive(true)}
      />

      {/* Displaying content based on whether the search bar is active */}
      {isSearchActive ? (
        // Search Results for Users
        <ScrollView>
          {filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.username}
              activeOpacity={0.7}
              onPress={() => navigateToProfile(user.username)}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                  backgroundColor: "#808080", // Light gray background
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Avatar
                  rounded
                  title={user.username.charAt(0).toUpperCase()}
                  containerStyle={{
                    backgroundColor: "#FFD700",
                    marginRight: 10,
                  }}
                  titleStyle={{ color: "black" }}
                />
                <Text style={{ color: "white" }}>{user.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          {/* Displaying fetched posts */}
          <View style={{flex: 1}}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "white"}}
            >
              Posts
            </Text>
            <FlatList
              style={{ height: 400}}
              data={posts}
              keyExtractor={(post) => post.id.toString()}
              renderItem={({ item: post }) => (
                <View style={styles.postContainer}>
                  {/* User Avatar with First Letter */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar
                      rounded
                      title={post.username.charAt(0).toUpperCase()}
                      containerStyle={{
                        backgroundColor: "#FFD700",
                        marginRight: 10,
                      }}
                      titleStyle={{ color: "black" }}
                    />
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color:"white"}}>
                        {post.username}
                      </Text>
                      <Text style={{ color: "#888" }}>
                        {calculateTimeAgo(post.date_time)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <Text style={{ marginBottom: 10,color: "white" }}>{post.body}</Text>
                  {post.workoutDetails ? (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 5,
                        color:"white"
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

          {/* Recommendations */}
          <View style={{height: 210}}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
                marginTop: 10,
                color: "white",
              }}
            >
              Recommendations
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ minHeight: 2500 }}
            >
              {userData.recommendations.map((profile, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    // Navigate to the profile screen with profile data
                    navigateToProfile(profile.username);
                  }}
                >
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#333333", // Light gray background
                      padding: 10,
                      marginRight: 10,
                      alignItems: "center",
                      height: 150,
                      width: 150,
                      borderRadius: 10,
                    }}
                    
                    onPress={() => changeRequestStatus(profile.username)}
                    // disabled={connectionRequests.includes(profile.username)}

                  >
                    
                    <Avatar
                      rounded
                      title={profile.username.charAt(0).toUpperCase()}
                      containerStyle={{
                        backgroundColor: "#FFD700",
                        //marginRight: 10,
                        width:60,
                        height:60,
                        borderRadius:30,
                        marginBottom:10,
                      }}
                      titleStyle={{ color: "black",fontSize:25}}
                    />

                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
                      @{profile.username}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#555", color: "white" }}>
                      {profile.percent.toFixed(2)}% Match
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: connectionRequests.includes(
                          profile.username
                        )
                          ? "green"
                          : "#007bff",
                        padding: 5,
                        borderRadius: 5,
                        marginTop: 4,
                      }}
                      onPress={() => sendConnectionRequest(profile.username)}
                      disabled={connectionRequests.includes(profile.username)}
                    >
                      <Text style={{ color: "#fff" }}>
                        {connectionRequests.includes(profile.username)
                          ? "Request Sent"
                          : "Connect"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1a1a1a", // Dark gray background
  },
  backButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  backButtonText: {
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
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
  searchInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "lightgrey", // Light grey search input background
  },
  postContainer: {
    backgroundColor: "#333333",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default FeedScreen;
