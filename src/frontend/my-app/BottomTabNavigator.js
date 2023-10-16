import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "./screens/FeedScreen";
import CreateWorkout from "./screens/CreateWorkout";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import Connections from "./screens/Connections";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ username }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen
        name="Create"
        children={() => <CreateWorkout username={username} />}
      />
      <Tab.Screen
        name="Profile"
        children={() => <Profile username={username} />}
      />
      <Tab.Screen
        name="Settings"
        children={() => <Settings username={username} />}
      />
      <Tab.Screen
        name="Connections"
        children={() => <Connections username={username} />}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
