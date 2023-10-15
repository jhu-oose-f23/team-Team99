import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "./screens/FeedScreen";
import CreateScreen from "./CreateWorkout";
import ProfileScreen from "./screens/Profile";

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
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
