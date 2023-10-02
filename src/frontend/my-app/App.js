// In App.js in a new project

import * as React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutDisplayScreen from './screens/WorkoutDisplay';
import CreateWorkout from "./CreateWorkout";

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to WorkoutDisplay"
        onPress={() => navigation.navigate("WorkoutDisplay")}
      />
      <Button
        title="Create workout"
        onPress={() => navigation.navigate("CreateWorkout")}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WorkoutDisplay" component={WorkoutDisplayScreen} />
        <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
