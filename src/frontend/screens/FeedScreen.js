import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Keyboard
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchRecommendations,
  postConnectionRequest,
  fetchConnectionRequestSource,
} from "../api";

const FeedScreen = ({ navigation, route }) => {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    recommendations: [],
  });

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

  const sendConnectionRequest = async (profileId) => {
    await postConnectionRequest(username, profileId);
    setConnectionRequests([...connectionRequests, profileId]);
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

  // Get Recommendations
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
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
                <Image
                  source={user.image}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: "white" }}>{user.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <>
          {/* Your Post component */}
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image
                source={require("../assets/icon.png")}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 30,
                }}
              />
              <View style={{ padding: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
                  Post Title
                </Text>
                <Text style={{ color: "white" }}>Post Author</Text>
              </View>
            </View>
            <Image
              source={require("../assets/favicon.png")}
              style={{
                width: 250,
                height: 250,
                marginBottom: 10,
              }}
            />
            <Text style={{ color: "white" }}>Post content goes here...</Text>
          </View>

          {/* Recommendations */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 10,
              color: "white",
            }}
          >
            Recommendations
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                    backgroundColor: "#808080", // Light gray background
                    padding: 10,
                    marginRight: 10,
                    alignItems: "center",
                    height: 180,
                    width: 180,
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={require("../assets/icon.png")}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      marginBottom: 10,
                    }}
                  />
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
                    @{profile.username}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#555", color: "white" }}>
                    {profile.percent.toFixed(2)}% Match
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: connectionRequests.includes(profile.username)
                        ? "green"
                        : "#007bff",
                      padding: 5,
                      borderRadius: 5,
                      marginTop: 10,
                    }}
                    onPress={() => sendConnectionRequest(profile.username)}
                    disabled={connectionRequests.includes(profile.username)}
                  >
                    <Text style={{ color: "white" }}>
                      {connectionRequests.includes(profile.username)
                        ? "Request Sent"
                        : "Connect"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
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
  searchInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "lightgrey", // Light grey search input background
  },
  postContainer: {
    backgroundColor: "#808080",
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
