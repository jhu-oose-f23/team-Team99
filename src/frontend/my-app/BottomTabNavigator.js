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
        component={CreateWorkout}
        initialParams={{ username: username }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{ username: username }}
      />
      <Tab.Screen
        name="Connections"
        component={Connections}
        initialParams={{ username: username }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        initialParams={{ username: username }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
