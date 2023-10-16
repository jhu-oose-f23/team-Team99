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
import { useFocusEffect } from "@react-navigation/native";
import { fetchConnections, fetchUser } from "../api";

const Connections = ({ username }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const navigateToProfile = () => {
    console.log("navigate to the clicked user's profile");
  };

  const disconnect = () => {
    if (isPressed) setIsPressed(false);
    else setIsPressed(true);
    console.log("Make disconnection");
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchConnectionsData = async () => {
        // TODO: update backend so GET connections returns an array of user objects instead of an array of usernames
        const connectionsResponse = await fetchConnections(username);
        setConnections(connectionsResponse);
        setConnectedUsers([]);
        await Promise.all(
          connectionsResponse.map(async (connectionUsername) => {
            const userResponse = await fetchUser(connectionUsername);
            setConnectedUsers((connectedUsers) => [
              ...connectedUsers,
              userResponse,
            ]);
          })
        );
        console.log(connectedUsers);

        setLoading(false);
      };
      fetchConnectionsData();
    }, [])
  );
  return (
    <ScrollView style={styles.container}>
      {connectedUsers.map((user, index) => (
        <TouchableOpacity
          onPress={navigateToProfile}
          style={styles.userContainer}
          key={index}
        >
          <Image
            source={require("../assets/profile.png")}
            style={styles.profileImage}
          />
          <View style={styles.textStyle}>
            <Text style={styles.username}>{"@" + user.username}</Text>
            <Text>{`${user.first_name} ${user.last_name}`}</Text>
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
