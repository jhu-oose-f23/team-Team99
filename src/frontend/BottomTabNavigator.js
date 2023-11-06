import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Feed from "./screens/FeedScreen";
import CreateWorkout from "./screens/CreateWorkout";
import Leaderboards from "./screens/Leaderboards";
import Leaderboard from "./screens/Leaderboard";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import Connections from "./screens/Connections";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const LeaderboardStack = ({ route }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Leaderboards"
      component={Leaderboards}
      initialParams={{ username: route.params.username }}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Leaderboard"
      component={Leaderboard}
      initialParams={{ username: route.params.username }}
      // options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const BottomTabNavigator = ({ route }) => {
  const { username } = route.params;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Feed"
        component={Feed}
        initialParams={{ username: username }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateWorkout}
        initialParams={{ username: username }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-add-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="LeaderboardStack"
        component={LeaderboardStack}
        initialParams={{ username: username }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{ username: username, loggedinUser: username }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Connections"
        component={Connections}
        initialParams={{ username: username }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-people" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        initialParams={{ username: username }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
