import * as React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./screens/Profile";
import CreateWorkout from "./CreateWorkout";
import BottomTabNavigator from "./BottomTabNavigator";

const username = "k1";

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile", { username: "blah" })}
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
      {/* <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      </Stack.Navigator> */}
      <BottomTabNavigator />
    </NavigationContainer>
  );
}

export default App;
