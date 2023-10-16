import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "./screens/FeedScreen";
import CreateScreen from "./CreateWorkout";
import ProfileScreen from "./screens/Profile";
import SettingsPage from "./screens/SettingsPage";
import ConnectionsPage from "./screens/connectionsPage";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ username }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen
        name="Create"
        children={() => <CreateScreen username={username} />}
      />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreen username={username} />}
      />
      <Tab.Screen
        name="Settings"
        children={() => <SettingsPage username={username} />}
      />
      <Tab.Screen
        name="Connections"
        children={() => <ConnectionsPage username={username} />}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
