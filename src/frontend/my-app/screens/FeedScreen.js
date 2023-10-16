import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchRecommendations, postConnectionRequest } from "../api";

const FeedScreen = ({ route }) => {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    recommendations: [],
  });

  const { username } = route.params;

  const sendConnectionRequest = async (profileId) => {
    await postConnectionRequest(
      username,
      userData.recommendations[profileId].username
    );
    setConnectionRequests((prevRequests) => [...prevRequests, profileId]);
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
        console.log(mappedUsers);
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
        const recommendationsResponse = await fetchRecommendations(username);
        setUserData({
          recommendations: recommendationsResponse,
        });
      };
      fetchData();
    }, [username])
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Search Bar */}
      <TextInput
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search..."
        onFocus={() => setIsSearchActive(true)}
        onBlur={() => setIsSearchActive(false)}
      />

      {/* Displaying content based on whether the search bar is active */}
      {isSearchActive ? (
        // Search Results for Users
        <ScrollView>
          {filteredUsers.map((user) => (
            <View
              key={user.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
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
              <Text>{user.name}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          {/* Your Post component */}
          <View
            style={{
              backgroundColor: "#ffffff",
              padding: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/icon.png")}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 30,
                }}
              />
              <View style={{ padding: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Post Title
                </Text>
                <Text>Post Author</Text>
              </View>
            </View>
            <Image
              source={require("../assets/favicon.png")}
              style={{
                width: 300,
                height: 300,
                marginBottom: 10,
              }}
            />
            <Text>Post content goes here...</Text>
          </View>

          {/* Recommendations */}
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            Recommendations
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {userData.recommendations.map((profile, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#ffffff",
                  padding: 10,
                  marginRight: 10,
                  alignItems: "center",
                  height: 180,
                  width: 180,
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
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  @{profile.username}
                </Text>
                <Text style={{ fontSize: 14, color: "#555" }}>
                  {profile.percent.toFixed(2)}% Match
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: connectionRequests.includes(index)
                      ? "green"
                      : "#007bff",
                    padding: 5,
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                  onPress={() => sendConnectionRequest(index)}
                  disabled={connectionRequests.includes(index)}
                >
                  <Text style={{ color: "#fff" }}>
                    {connectionRequests.includes(index)
                      ? "Request Sent"
                      : "Connect"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default FeedScreen;
