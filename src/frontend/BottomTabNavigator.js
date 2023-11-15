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
import Privacy from "./screens/settingsScreens/privacy";
import Notifications from "./screens/settingsScreens/Notifications";
import TermsAndPolicies from "./screens/settingsScreens/TermsAndPolicies";
import EditProfile from "./screens/settingsScreens/editProfile";
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

const SettingsNavigation = ({route}) => {
  return (
    <Stack.Navigator>
    <Stack.Screen name="Settings" 
      component={Settings} 
      initialParams={{username: route.params.username}}/>
    <Stack.Screen name="Edit Profile" 
      component={EditProfile}
      initialParams={{username: route.params.username}}
       />
    <Stack.Screen name="Privacy" component={Privacy}/>
    <Stack.Screen name="Notifications" component={Notifications}/>
    <Stack.Screen name="Terms and Policies" component={TermsAndPolicies}/>
  </Stack.Navigator>
  )
  
}

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
        component={SettingsNavigation}
        initialParams={{ username: username }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-settings" color={color} size={size} />
          ),
          
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
