import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from "react-native";

const users = [
  {
    id: 4,
    name: "Lucas Brown",
    image: require("../assets/icon.png"),
  },
  {
    id: 5,
    name: "Emily Clark",
    image: require("../assets/icon.png"),
  },
  // ... Add more users as needed
];

const recommendations = [
  {
    id: 1,
    name: "John Doe",
    image: require("../assets/icon.png"), // Replace with the actual image path
  },
  {
    id: 2,
    name: "Jane Smith",
    image: require("../assets/icon.png"), // Replace with the actual image path
  },
  {
    id: 3,
    name: "Smith Doe",
    image: require("../assets/icon.png"), // Replace with the actual image path
  },
  // Add more profile recommendations as needed
];

const FeedScreen = () => {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const sendConnectionRequest = (profileId) => {
      // Simulate a network request to send a connection request
      // You can replace this with actual API calls in your app
    setTimeout(() => {
      setConnectionRequests((prevRequests) => [...prevRequests, profileId]);
    }, 1000);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
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
            style={{ backgroundColor: "#ffffff", padding: 10, marginBottom: 10 }}
          >
            {/* ... Rest of your Post code */}
          </View>

          {/* Recommendations */}
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            Recommendations
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendations.map((profile) => (
              <View
                key={profile.id}
                style={{
                  backgroundColor: "#ffffff",
                  padding: 10,
                  marginRight: 10,
                  alignItems: "center",
                  height: 150,
                  width: 150,
                }}
              >
                <Image
                  source={profile.image}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginBottom: 10,
                  }}
                />
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {profile.name}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: connectionRequests.includes(profile.id)
                      ? "green"
                      : "#007bff",
                    padding: 5,
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                  onPress={() => sendConnectionRequest(profile.id)}
                  disabled={connectionRequests.includes(profile.id)}
                >
                  <Text style={{ color: "#fff" }}>
                    {connectionRequests.includes(profile.id)
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
