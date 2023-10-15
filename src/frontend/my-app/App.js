import * as React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./screens/Profile";
import BottomTabNavigator from "./BottomTabNavigator";

// Test username
const username = "k1";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator username={username} />
    </NavigationContainer>
  );
}

export default App;
