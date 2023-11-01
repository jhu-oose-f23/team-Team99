import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import UserContext from "../UserContext";
// Define the Supabase API URL for login
const loginApiUrl = "https://gymconnectbackend.onrender.com/user/login";

const Login = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserLoggedIn } = useContext(UserContext);
  const handleLogin = async () => {
    try {
      const response = await fetch(loginApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 200) {
        // Authentication successful
        const userData = await response.json();
        setUserLoggedIn(userData.username);
        navigation.navigate("Main", {
          screen: "Profile",
          params: {
            username: userData.username,
            loggedinUser: userData.username,
          },
        });

        // TODO: Store the username in a secure location
        // Here, we are simply alerting the username
        Alert.alert(
          "Login Successful",
          `You are now logged in as ${userData.username}`
        );
      } else {
        // Authentication failed
        Alert.alert("Login Failed", "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Login;
