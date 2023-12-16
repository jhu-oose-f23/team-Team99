import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { fetchLeaderboardList } from "../api";

const CreateOverview = ({ navigation, route }) => {
  const username = route.params.username;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        key={0}
        style={styles.listItem}
        onPress={() =>
          navigation.navigate("CreateWorkout", {
            username: username,
          })
        }
      >
        <Card containerStyle={styles.card}>
          <View style={styles.listItemContent}>
            <Icon
              //   name={leaderboard.icon}
              type="font-awesome"
              size={30}
              color="#555"
            />
            <Text style={styles.listItemText}>Create Workout</Text>
            <Ionicons name="ios-arrow-forward" size={24} color="white" />
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        key={1}
        style={styles.listItem}
        onPress={() =>
          navigation.navigate("CreatePost", {
            username: username,
          })
        }
      >
        <Card containerStyle={styles.card}>
          <View style={styles.listItemContent}>
            <Icon
              //   name={leaderboard.icon}
              type="font-awesome"
              size={30}
              color="#555"
            />
            <Text style={styles.listItemText}>Create Post</Text>
            <Ionicons name="ios-arrow-forward" size={24} color="white" />
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a", // Dark grey background
  },
  listItem: {
    marginVertical: 10,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#333333", // Light grey background for buttons
  },
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  listItemText: {
    fontSize: 18,
    color: "white", // White text color
  },
});

export default CreateOverview;
