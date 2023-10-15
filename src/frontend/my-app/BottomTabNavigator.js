import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "./screens/FeedScreen";
import CreateScreen from "./CreateWorkout";
import ProfileScreen from "./screens/Profile";

const Tab = createBottomTabNavigator();
const username = "k1";

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreen username={username} />}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
