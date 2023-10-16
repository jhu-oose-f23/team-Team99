import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";

const Stack = createNativeStackNavigator();

const AuthenticationStack = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login">
                {({ navigation }) => (
                    <Login setUserLoggedIn={setUserLoggedIn} navigation={navigation} />
                )}
            </Stack.Screen>
          {/*include other screens for authentication purposes here */}
        </Stack.Navigator>
      );
};

export default AuthenticationStack;
