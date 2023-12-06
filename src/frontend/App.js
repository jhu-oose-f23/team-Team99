import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";
import Login from "./screens/Login";
import Signup from "./screens/Signup"; // Assuming you have a Signup component
import { useState, createContext } from "react";
import UserContext from "./UserContext";
import { fetchUser } from "./api";

const Stack = createNativeStackNavigator();

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState("");
  const [userHasSignedUp, setUserHasSignedUp] = useState(false);

  return (
    <UserContext.Provider
      value={{ userLoggedIn, setUserLoggedIn, setUserHasSignedUp }}
    >
      <NavigationContainer>
        <Stack.Navigator>
          {/* {userLoggedIn ? (
            userHasSignedUp ? (
              // If logged in and signed up, go to the main screen
              <Stack.Screen
                name="Main"
                component={BottomTabNavigator}
                initialParams={{ username: userLoggedIn }}
                options={{ headerShown: false }}
              />
            ) : (
              // If logged in but not signed up, go to the signup screen
              <Stack.Screen
                name="Signup"
                component={Signup}
                initialParams={{ username: userLoggedIn }}
                options={{ headerShown: false }}
              />
            )
          ) : (
            // If not logged in, go to the login screen
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
              initialParams={{ username: userLoggedIn }}
            />
          )} */}
          <Stack.Screen
            name="Signup"
            component={Signup}
            initialParams={{ username: userLoggedIn }}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default App;
