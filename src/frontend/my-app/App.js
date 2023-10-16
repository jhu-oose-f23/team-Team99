import * as React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./screens/Profile";
import CreateWorkout from "./screens/CreateWorkout";
import BottomTabNavigator from "./BottomTabNavigator";
import FeedScreen from "./screens/FeedScreen";
import Login from "./screens/Login";
import AuthenticationStack from "./AuthenticationStack";

const Stack = createNativeStackNavigator();

function App() {
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userLoggedIn ? (
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            initialParams={{ setUserLoggedIn }}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
