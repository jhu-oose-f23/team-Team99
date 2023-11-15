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
          <Text style={{ fontSize: 20 }}>Connection Requests</Text>
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
                <Text>{`${user.first_name} ${user.last_name}`}</Text>
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

      <Text style={{ fontSize: 20 }}>Active Connections</Text>
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
              <Text>{`${user.first_name} ${user.last_name}`}</Text>
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
