import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";

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

  const sendConnectionRequest = (profileId) => {
      // Simulate a network request to send a connection request
      // You can replace this with actual API calls in your app
    setTimeout(() => {
      setConnectionRequests((prevRequests) => [...prevRequests, profileId]);
    }, 1000);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Post */}
      <View
        style={{ backgroundColor: "#ffffff", padding: 10, marginBottom: 10 }}
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
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Post Title</Text>
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
    </View>
  );
};

export default FeedScreen;
