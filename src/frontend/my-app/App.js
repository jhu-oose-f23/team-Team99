// In App.js in a new project

import * as React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutDisplayScreen from './screens/WorkoutDisplay';
import CreateWorkout from "./screens/CreateWorkout";
import Connections from "./screens/connections";
import { ToastProvider } from "./components/CreateWorkoutToast";

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
      
      <Button
        title="Connections"
        onPress={()=> navigation.navigate("Connections")}
      />

    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="WorkoutDisplay" component={WorkoutDisplayScreen} />
          <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
          <Stack.Screen name="Connections" component={Connections}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

export default App;
