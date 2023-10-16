import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Profile from "../assets/profile.png";
import { Button } from "react-native-paper";

const Connections = () => {
  const [isPressed, setIsPressed] = useState(false);

  const navigateToProfile = () => {
    console.log("navigate to the clicked user's profile");
  };

  const disconnect = () => {
    if (isPressed) setIsPressed(false);
    else setIsPressed(true);
    console.log("Make disconnection");
  };

  return (
    <ScrollView style={styles.container}>
      {users.map((user) => (
        <TouchableOpacity
          onPress={navigateToProfile}
          style={styles.userContainer}
          key={user.id}
        >
          <Image
            source={require("../assets/profile.png")}
            style={styles.profileImage}
          />
          <View style={styles.textStyle}>
            <Text style={styles.username}>{"@" + user.username}</Text>
            <Text>{`${user.firstName} ${user.lastName}`}</Text>
          </View>

          <View style={styles.buttonStyle}>
            <Button
              style={[styles.button, isPressed ? styles.buttonPressed : null]}
              onPress={disconnect}
            >
              Connected
            </Button>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: "relative",
  },

  buttonStyle: {
    justifyContent: "flext-end",
  },

  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 10,
    borderBlockColor: "gray",
    borderWidth: 2,
  },

  textStyle: {
    flex: 0.95,
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },

  button: {
    borderRadius: 5,
    backgroundColor: "skyblue",
    alignSelf: "flex-start",
  },

  buttonPressed: {
    backgroundColor: "gray",
  },
});

export default Connections;

const users = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    profilePicture: Profile,
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    profilePicture: Profile,
  },
];
