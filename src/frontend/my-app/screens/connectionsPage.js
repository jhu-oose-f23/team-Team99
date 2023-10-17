import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Profile from "../assets/profile.png"
import { Button } from 'react-native-paper';

const Connections = () => {

  const [connectedUsers, setConnectedUsers] = useState([]);
  const [user, setUser] = useState('k1');
  const [requestsAvailable, setRequestsAvailable] = useState(false)
  const [connectionRequests, setConnectionRequests] = useState([])
  const connnectionsAPI = 'https://gymconnectbackend.onrender.com/connection';
  const requestAPI = 'https://gymconnectbackend.onrender.com/connection/request/'

  const navigateToProfile = () => {
    console.log("navigate to the clicked user's profile")
  }

  const acceptRequest = (username) => {

    // Delete the request from requests
    
    deleteAPI = requestAPI + username + "/" + user;
    fetch(deleteAPI, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('connection deleted');
        } else {
          console.error('delete failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Add the users to the connectedUsers
    
   
  }

    // Function to fetch data from an API
  async function fetchData(apiEndpoint) {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error("Failed to get data");
    }
    return response.json();
  }

  // Define the API endpoints
  const requestsAPI = 'https://gymconnectbackend.onrender.com/connection/request/' + user;
  const usersAPI = 'https://gymconnectbackend.onrender.com/user';

  // Fetch data from both APIs

  useEffect(() => {
    Promise.all([fetchData(requestsAPI), fetchData(usersAPI)])
    .then(([userNames, users]) => {

      console.log("The first data", userNames)
      console.log("The second data", users)

      const requestedUsers = users.filter(user => userNames.includes(user.username));
      console.log("Filtered data", requestedUsers)
      if (requestedUsers) {
        setRequestsAvailable(true)
        setConnectionRequests(requestedUsers)
      }
      else {
        setRequestsAvailable(false)
      }
    })
    .catch(error => {
      setRequestsAvailable(false)
      console.error(error);
    });

  }, [])
  

  const getConnectedUsers = async () => {
    const apiUsers = 'https://gymconnectbackend.onrender.com/connection/' + user;

    try {
      fetch(apiUsers).then(response => response.json()).
        then((responseData) => {
          setConnectedUsers(responseData);
        }); 
        setConnectedUsersAvailable(true)
    }

    catch (error){
      console.log("there is an error", error)
      setConnectedUsersAvailable(false)
    }
  };


  useEffect(() => {
    getConnectedUsers();
  }, []);


  const RenderRequests = () => {

    if (requestsAvailable) {
      return (
        <View>
          <Text 
                style={{alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: "lightblue"}}>
                  CONNECTION REQUESTS
              </Text>
            {connectionRequests.map((user) => (
              <TouchableOpacity 
                onPress={navigateToProfile}
                style={styles.userContainerRequest} 
                key={user.id}
                >
                
                <Image 
                  source={require ("../assets/profile.png") } 
                  style={styles.profileImage} 
                />
                <View style={styles.textStyle}>
                  <Text style={styles.username}>{"@" + user.username}</Text>
                  <Text>{`${user.firstName} ${user.lastName}`}</Text>
                </View>

                <View style={styles.buttonStyle}>
                  <Button
                    style={[styles.button]}
                    onPress={() => acceptRequest(user.username)}
                    
                  >Accept</Button>
                </View>
                
              </TouchableOpacity>
            ))}
        </View>
      );
    }

    else {
      return null;
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <RenderRequests/>
      <View>
        <Text style={{alignSelf: 'center', fontSize: 18, fontWeight: 'bold'}}>CONNECTED</Text>
      </View>
      
      <View>
        {connectedUsers.map((user) => (
          <TouchableOpacity 
            onPress={navigateToProfile}
            style={styles.userContainer} 
            key={user.id}
            >
            
            <Image 
              source={require ("../assets/profile.png") } 
              style={styles.profileImage} 
            />
            <View style={styles.textStyle}>
              <Text style={styles.username}>{"@" + user.username}</Text>
              <Text>{`${user.firstName} ${user.lastName}`}</Text>
            </View>

            <View style={styles.buttonStyle}>
              <Button
                style={[styles.button]}
              
              >Connected</Button>
            </View>
            
          </TouchableOpacity>
        ))}

      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: "relative"
  },

  buttonStyle: {
    justifyContent: "flext-end",
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 10,
    borderBlockColor: "gray",
    borderWidth: 2,
  },

  userContainerRequest: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 10,
    borderBlockColor: "gray",
    backgroundColor: "lightgray",
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
    fontWeight: 'bold',
  },

  button: {
    borderRadius: 5,
    backgroundColor: "skyblue",
    alignSelf: 'flex-start'
  },

  buttonPressed: {
    backgroundColor: "skyblue"
  }
});

export default Connections;

