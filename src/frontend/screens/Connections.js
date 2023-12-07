import React, { useEffect, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  fetchConnections,
  fetchConnectionRequest,
  PutConnectionRequest,
  fetchUser,
  fetchAllUsers,
  deleteConnection,
  removeExistingConnection,
} from "../api";
import { navigateToProfile } from "../Helpers";

const Connections = ({ route, navigation }) => {
  const username = route.params.username;
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [Requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [deleteThisConnection, setDeleteThisConnection] = useState("");
  const [requestsUsernames, setRequestsUsernames] = useState([]);
  const acceptConn = (src, dst) => {
    const acceptConnection = async () => {
      const data = PutConnectionRequest(src, dst);
      if (!data) {
        console.log("Accepting connection failed!", data);
      }
    };
    const newRequests = Requests.filter((item) => item.username !== src);
    setRequests(newRequests);
    // Get user metadata and add to connections
    const acceptedConnection = allUsers.filter((u) => u.username === src);
    setConnections([...connections, ...acceptedConnection]);
    acceptConnection();
  };

  const disconnect = (usr1, usr2) => {
    const removeConn = () => {
      const data = removeExistingConnection(usr1, usr2);
      if (!data) {
        console.log("Removing connection failed!", data);
      }
      else {
        console.log("Connection removed successfully!", data);
      }
    };
    const newConnection = connections.filter((item) => item.username !== usr1);
    setConnections(newConnection);
    removeConn();
  }

  const rejectConn = (src, dst) => {
    const rejectConnection = () => {
      const data = deleteConnection(src, dst);
      if (!data) {
        console.log("Accepting connection failed!", data);
      } else {
        console.log("Accepting connection success", data);
      }
    };
    const newRequests = Requests.filter((item) => item.username !== src);
    setRequests(newRequests);
    rejectConnection();
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUsers = async () => {
        const usersResponse = await fetchAllUsers();
        setAllUsers(usersResponse ? usersResponse : []);
      };
      fetchUsers();

      const fetchRequests = async () => {
        await fetchConnectionRequest(username).then((data) => {
          setRequestsUsernames(data ? data : []);

          const requestUsersMetadata = allUsers.filter((item) =>
            data.includes(item.username)
          );
          setRequests(requestUsersMetadata);
        });
      };

      fetchRequests();

      const fetchConnectionsData = async () => {
        const connectionsResponse = await fetchConnections(username);
        setConnections(connectionsResponse ? connectionsResponse : []);
        setLoading(false);
      };

      fetchConnectionsData();
    }, [])
  );

  useEffect(() => {
    const requestUsersMetadata = allUsers.filter((item) =>
      requestsUsernames.includes(item.username)
    );
    setRequests(requestUsersMetadata);
  }, [allUsers, requestsUsernames]);

  const RenderRequests = () => {
    return (
      <>
        {Requests.length > 0 && (
          <Text style={styles.goldText}>Connection Requests</Text>
        )}

        {Requests &&
          Requests.map((user, index) => (
            <TouchableOpacity
              onPress={() =>
                navigateToProfile(navigation, user.username, username)
              }
              style={styles.userContainer}
              key={index}
            >
              <Image
                source={require("../assets/profile.png")}
                style={styles.profileImage}
              />
              <View style={styles.textStyle}>
                <Text style={styles.username}>{"@" + user.username}</Text>
                <Text style={styles.whiteText}>{`${user.first_name} ${user.last_name}`}</Text>
              </View>

              <View style={styles.buttonStyle}>
                <Button
                  style={[
                    styles.button,
                    isPressed ? styles.buttonPressed : null,
                  ]}
                  onPress={() => acceptConn(user.username, username)}
                >
                  Accept
                </Button>
              </View>
              <View>
                <Button onPress={() => rejectConn(user.username, username)}>
                  Reject
                </Button>
              </View>
            </TouchableOpacity>
          ))}
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <RenderRequests />

      <Text style={styles.goldText}>Active Connections</Text>
      {connections &&
        connections.map((user, index) => (
          <TouchableOpacity
            onPress={() =>
              navigateToProfile(navigation, user.username, username)
            }
            style={styles.userContainer}
            key={index}
          >
            <Image
              source={require("../assets/profile.png")}
              style={styles.profileImage}
            />
            <View style={styles.textStyle}>
              <Text style={styles.username}>{"@" + user.username}</Text>
              <Text style={styles.whiteText}>{`${user.first_name} ${user.last_name}`}</Text>
            </View>

            <View style={styles.buttonStyle}>
              <Button
                style={[styles.button, isPressed ? styles.buttonPressed : null]}
                onPress={() => disconnect(user.username, username)}
              >
                Remove
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
    backgroundColor: "#1a1a1a", // Dark background color
  },

  buttonStyle: {
    justifyContent: "flex-end", // Adjusted to move buttons to the right
  },

  goldText: {
    fontSize: 20,
    color: "#ffd700", // Gold text color
    marginBottom: 10,
  },

  whiteText: {
    color: "#fff", // White text color
  },

  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "#333", // Dark border color
    borderWidth: 2,
    padding: 10,
    backgroundColor: "#808080", // Dark background color
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
    color: "#ffd700", // Gold text color
  },

  button: {
    borderRadius: 5,
    backgroundColor: "#ffd700", // Gold button color
    alignSelf: "flex-start",
    paddingVertical: 5,
    color: "#fff",
  },

  buttonPressed: {
    backgroundColor: "#555", // Dark gray color
  },
});

export default Connections;
