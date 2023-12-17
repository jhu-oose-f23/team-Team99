import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Feed from "./screens/FeedScreen";
import CreateOverview from "./screens/CreateOverview";
import CreateWorkout from "./screens/CreateWorkout";
import CreatePost from "./screens/CreatePost";
import LeaderboardOverview from "./screens/LeaderboardsOverview";
import LeaderboardTabs from "./screens/Leaderboard";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import Connections from "./screens/Connections";
import Privacy from "./screens/settingsScreens/privacy";
import Notifications from "./screens/settingsScreens/Notifications";
import TermsAndPolicies from "./screens/settingsScreens/TermsAndPolicies";
import EditProfile from "./screens/settingsScreens/EditProfile";
import Calendar from "./screens/Calendar";
import EditWorkout from "./screens/CalendarScreens/editWorkout";
import AddWorkout from "./screens/CalendarScreens/addWorkout";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EditSession from "./screens/CalendarScreens/editSession";
import {
  HeaderButtons,
  Item,
  HiddenItem,
  OverflowMenu,
  Divider,
  ItemProps,
  HiddenItemProps,
  HeaderButtonProps,
  HeaderButton,
} from "react-navigation-header-buttons";
import { useNavigation } from "@react-navigation/native";

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
      options={{
        title: "Leaderboard", // Set the title for this screen's header
        headerStyle: {
          backgroundColor: "#1a1a1a", // Set the background color
        },
        headerTintColor: "gold", // Set the text color
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  </Stack.Navigator>
);

const CreateStack = ({ route }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="CreateOverview"
      component={CreateOverview}
      initialParams={{ username: route.params.username }}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateWorkout"
      component={CreateWorkout}
      initialParams={{ username: route.params.username }}
    />
    <Stack.Screen
      name="CreatePost"
      component={CreatePost}
      initialParams={{ username: route.params.username }}
    />
  </Stack.Navigator>
);

const SettingsNavigation = ({ route }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        initialParams={{ username: route.params.username }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfile}
        initialParams={{ username: route.params.username }}
      />
    </Stack.Navigator>
  );
};

const CalendarNavigation = ({ route }) => {
  const { navigate } = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Calendar "
        component={Calendar}
        initialParams={{ username: route.params.username }}
        options={{
          headerRight: () => (
            <OverflowMenu
              OverflowIcon={({ color }) => (
                <MaterialIcons name="more-horiz" size={23} color={color} />
              )}
            >
              <HiddenItem
                title="Edit Workout"
                onPress={() => navigate("Edit Calendar")}
              />
              <HiddenItem
                title="Add Workout"
                onPress={() => navigate("Add Workout")}
              />
              <Divider />
            </OverflowMenu>
          ),
        }}
      />
      <Stack.Screen
        name="Edit Calendar"
        component={EditWorkout}
        initialParams={{ username: route.params.username }}
      />
      <Stack.Screen
        name="Add Workout"
        initialParams={{ username: route.params.username }}
        component={AddWorkout}
      />
      <Stack.Screen
        name="Edit Session"
        initialParams={{ username: route.params.username, session: {} }}
        component={EditSession}
      />
    </Stack.Navigator>
  );
};

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
    <Tab.Navigator screenOptions={screenOptions}>
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
        component={CreateStack}
        initialParams={{ username: username }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-add-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarNavigation}
        initialParams={{ username: username }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-calendar-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboards"
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
          tabBarButton: () => null, // Hide the tab bar icon
        }}
      />
      <Tab.Screen
        name="SettingsMain"
        component={SettingsNavigation}
        initialParams={{ username: username }}
        options={{
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
