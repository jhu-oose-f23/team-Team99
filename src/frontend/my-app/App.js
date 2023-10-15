import * as React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./screens/Profile";
import CreateWorkout from "./CreateWorkout";
import BottomTabNavigator from "./BottomTabNavigator";
import FeedScreen from "./screens/FeedScreen";

// Test username
const username = "k1";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator username={username} />
      {/* <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
        <Stack.Screen name="Feed" component={FeedScreen} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}

export default App;
