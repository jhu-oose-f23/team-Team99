import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const leaderboards = [
  { id: 1, name: "Deadlift", icon: "trophy" },
  { id: 2, name: "Bench Press", icon: "trophy" },
  // Add more leaderboards as needed
];

const Leaderboards = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Popular Leaderboards</Text>
      {leaderboards.map((leaderboard) => (
        <TouchableOpacity
          key={leaderboard.id}
          style={styles.listItem}
          onPress={() =>
            navigation.navigate("Leaderboard", {
              name: leaderboard.name,
            })
          }
        >
          <Card containerStyle={styles.card}>
            <View style={styles.listItemContent}>
              <Icon
                name={leaderboard.icon}
                type="font-awesome"
                size={30}
                color="#555"
              />
              <Text style={styles.listItemText}>{leaderboard.name}</Text>
              <Ionicons name="ios-arrow-forward" size={24} color="#555" />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
  },
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 18,
  },
});

export default Leaderboards;
