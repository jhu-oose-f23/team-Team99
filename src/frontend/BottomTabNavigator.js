import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Feed from "./screens/FeedScreen";
import CreateWorkout from "./screens/CreateWorkout";
import LeaderboardOverview from "./screens/LeaderboardsOverview";
import LeaderboardTabs from "./screens/Leaderboard";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import Connections from "./screens/Connections";
import Calendar from "./screens/Calendar";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const LeaderboardStack = ({ route }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="LeaderboardOverview"
      component={LeaderboardOverview}
      initialParams={{ username: route.params.username }}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Leaderboard"
      component={LeaderboardTabs}
      initialParams={{ username: route.params.username }}
      // options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const screenOptions = {
  tabBarActiveTintColor: "#ffd700", // Gold for active tab
  tabBarInactiveTintColor: "#fff", // White for inactive tab
  tabBarStyle: {
    backgroundColor: "#1a1a1a", // Dark background color
  },
  headerStyle: {
    backgroundColor: "#1a1a1a", // Dark background color for header
  },
  headerTitleStyle: {
    color: "#ffd700", // Gold title color
  },
};

const BottomTabNavigator = ({ route }) => {
  const { username } = route.params;
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
    >
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
        name="Calendar"
        component={Calendar}
        initialParams={{ username: username }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-calendar-sharp" color={color} size={size} />
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
