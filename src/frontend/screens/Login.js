import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import UserContext from "../UserContext";

const loginApiUrl = "https://gymconnectbackend.onrender.com/user/login";

const Login = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserLoggedIn } = useContext(UserContext);

  const handleLogin = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#ccc"
        placeholder="Enter your username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#ccc" 
        placeholder="Enter your password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Button
        title="Login"
        onPress={handleLogin}
        disabled={isLoading}
        color="#ffd700" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#1a1a1a", 
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#ffd700", 
  },
  input: {
    height: 40,
    borderColor: "#ffd700", 
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#fff", 
  },
});

export default Login;
