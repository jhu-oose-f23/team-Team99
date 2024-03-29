import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { fetchLeaderboardList } from "../api";

const Leaderboards = ({ navigation, route }) => {
  const [leaderboardList, setLeaderboardList] = useState([]);

  const username = route.params.username;

  // Get Leaderboard List
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const leaderboardListResponse = await fetchLeaderboardList();
        setLeaderboardList(leaderboardListResponse);
      };
      fetchData();
    }, [username])
  );

  return (
    <View style={styles.container}>
      {leaderboardList.map((leaderboard) => (
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
                color="#FFD700"
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
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a", // Dark gray background
  },
  listItem: {
    marginVertical: 5,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#333333", // Light grey button background
  },
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 18,
    color: "white", // White text
  },
});

export default Leaderboards;
