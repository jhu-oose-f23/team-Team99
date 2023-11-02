import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";
import Login from "./screens/Login";
import { useState, createContext, useContext } from "react";
import UserContext from "./UserContext";

const Stack = createNativeStackNavigator();

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState("");

  return (
    <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
      <NavigationContainer>
        <Stack.Navigator>
          {userLoggedIn ? (
            <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
              initialParams={{ username: userLoggedIn }}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default App;
