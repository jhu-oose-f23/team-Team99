import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { fetchLeaderboard, fetchLeaderboardUser } from "../api";

const Tab = createMaterialTopTabNavigator();

const GlobalLeaderboard = ({ navigation, route }) => {
  const username = route.params.username;
  const name = route.params.name;
  const [leaderboard, setLeaderboard] = useState([]);

  // Get Leaderboard
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const leaderboardResponse = await fetchLeaderboard(name);
        setLeaderboard(leaderboardResponse);
      };
      fetchData();
    }, [username])
  );

  const navigateToProfile = (navigateToUsername) => {
    navigation.navigate("Profile", {
      username: navigateToUsername,
      loggedinUser: username,
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigateToProfile(item.username)}
      style={[
        styles.row,
        item.username === username ? styles.highlighted : null,
      ]}
    >
      <Text style={styles.rank}>{index + 1}</Text>
      <Avatar
        rounded
        title={item.username[0].toUpperCase()}
        size="medium"
        containerStyle={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.score}>Weight: {item.score}</Text>
      </View>
      <Text style={styles.rank}>
        {index === 0 && (
          <FontAwesome5Icon name="crown" solid color="#ffd700" size={16} />
        )}
        {index === 1 && (
          <FontAwesome5Icon name="crown" solid color="#c0c0c0" size={16} />
        )}
        {index === 2 && (
          <FontAwesome5Icon name="crown" solid color="#cd7f32" size={16} />
        )}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name} Leaderboard</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item) => item.username}
      />
    </View>
  );
};

const WeightClassLeaderboard = ({ navigation, route }) => {
  const username = route.params.username;
  const name = route.params.name;
  const [leaderboard, setLeaderboard] = useState([]);

  // Get Leaderboard
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const leaderboardResponse = await fetchLeaderboardUser(name, username);
        console.log(leaderboardResponse);
        setLeaderboard(leaderboardResponse);
      };
      fetchData();
    }, [username])
  );

  const navigateToProfile = (navigateToUsername) => {
    navigation.navigate("Profile", {
      username: navigateToUsername,
      loggedinUser: username,
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigateToProfile(item.username)}
      style={[
        styles.row,
        item.username === username ? styles.highlighted : null,
      ]}
    >
      <Text style={styles.rank}>{index + 1}</Text>
      <Avatar
        rounded
        title={item.username[0].toUpperCase()}
        size="medium"
        containerStyle={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.score}>Weight: {item.score}</Text>
      </View>
      <Text style={styles.rank}>
        {index === 0 && (
          <FontAwesome5Icon name="crown" solid color="#ffd700" size={16} />
        )}
        {index === 1 && (
          <FontAwesome5Icon name="crown" solid color="#c0c0c0" size={16} />
        )}
        {index === 2 && (
          <FontAwesome5Icon name="crown" solid color="#cd7f32" size={16} />
        )}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name} Leaderboard</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item) => item.username}
      />
    </View>
  );
};

const LeaderboardTabs = ({ route }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'gold', // Color for the active tab
        tabBarInactiveTintColor: 'white', // Color for inactive tabs
        tabBarStyle: {
          backgroundColor: '#404040', // Background color for the tab bar
        },
        tabBarLabelStyle: {
          fontSize: 16, // Adjust the font size of the tab labels
        },
        tabBarIndicatorStyle: {
          backgroundColor: 'gold', // Color for the tab indicator (line under the active tab)
        },
      }}
    >
      <Tab.Screen
        name="Global"
        component={GlobalLeaderboard}
        initialParams={route.params}
      />
      <Tab.Screen
        name="My Weight Class"
        component={WeightClassLeaderboard}
        initialParams={route.params}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "gold",
  },
  row: {
    backgroundColor: "#808080",
    borderRadius: 10,
    margin: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  highlighted: {
    backgroundColor: "lightblue",
  },
  avatar: {
    backgroundColor: "#CCCCCC",
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    color: "white",
  },
  score: {
    fontSize: 14,
    color: "white",
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  },
});

export default LeaderboardTabs;
