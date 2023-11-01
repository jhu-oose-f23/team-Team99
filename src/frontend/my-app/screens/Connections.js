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
// import { useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { fetchConnections, fetchConnectionRequest, PutConnectionRequest, fetchUser, fetchAllUsers, deleteConnection} from "../api";


const Connections = ({ route, navigation }) => {
  const username = route.params.username;
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [Requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [deleteThisConnection, setDeleteThisConnection] = useState('')
  const [requestsUsernames, setRequestsUsernames] = useState([])

  const navigateToProfile = (navigateToUsername) => {
    navigation.navigate("Profile", {
      username: navigateToUsername,
      loggedinUser: username,
    });
  };

  const acceptConn = (src, dst) => {
        const acceptConnection = async () => {
          const data = PutConnectionRequest(src, dst)
          if (!data) {
            console.log("Accepting connection failed!", data)
          }
        };

        acceptConnection();
  };

  const rejectConn = (src, dst) => {
    const rejectConnection = () => {
      const data = deleteConnection(src, dst)
      if (!data) {
        console.log("Accepting connection failed!", data)
      }
      else {
        console.log("Accepting connection success", data)
      }
    };

    rejectConnection();
  }


  const disconnect = (src, dst) => {    // ToDo: implement disconnection

  }

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const usersResponse = await fetchAllUsers();
  //     setAllUsers(usersResponse ? usersResponse : [])
  //     console.log("this is all users", allUsers)
  //   }
  //   fetchUsers();
  // }, [])

  // useEffect(() => {
  //   console.log("Inside a use effect", allUsers)

  //   const fetchRequests = async () => {
  //     await fetchConnectionRequest(username).then((data)=> {
       
  //       const requestUsersMetadata = allUsers.filter(item => data.includes(item.username));
  //       setRequests(requestUsersMetadata);
 
  //       console.log("All request available", Requests)
        
        
  //     });
  //   }
  //   fetchRequests();

  // }, [allUsers])





  useFocusEffect(
    React.useCallback(() => {

      const fetchUsers = async () => {
        const usersResponse = await fetchAllUsers();
        setAllUsers(usersResponse ? usersResponse : [])
        console.log("this is all users", allUsers)
      }
      fetchUsers();

      const fetchRequests = async () => {
      await fetchConnectionRequest(username).then((data)=> {

        setRequestsUsernames(data ? data: [])
       
        const requestUsersMetadata = allUsers.filter(item => data.includes(item.username));
        setRequests(requestUsersMetadata);
 
        console.log("All request available", Requests)
        
        
      });
    }

    fetchRequests();

      const fetchConnectionsData = async () => {
        const connectionsResponse = await fetchConnections(username);
        setConnections(connectionsResponse ? connectionsResponse : []);
        setLoading(false);
      };

      fetchConnectionsData();

    }, [])
  )

  useEffect(() => {
    const requestUsersMetadata = allUsers.filter(item => requestsUsernames.includes(item.username));
    setRequests(requestUsersMetadata);
  }, [allUsers, requestsUsernames])


  const RenderRequests = () => {

      return (
          <>
          {Requests.length > 0 && 
            <Text style={{fontSize: 20}}>Connection Requests</Text>}

          {Requests &&
            Requests.map((user, index) => (
              <TouchableOpacity
                onPress={() => navigateToProfile(user.username)}
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
                    onPress={() => acceptConn(user.username, username)}
                  >
                    Accept
                  </Button>
                </View>
                <View>
                  <Button 
                    onPress={() => rejectConn(user.username, username)}>Reject</Button>
                </View>

                
              </TouchableOpacity>
            ))}
            </>
      )

    }


  return (
    <ScrollView style={styles.container}>
      <RenderRequests/>

      <Text style={{fontSize: 20}}>Active Connections</Text>
      {connections &&
        connections.map((user, index) => (
          <TouchableOpacity
            onPress={() => navigateToProfile(user.username)}
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
