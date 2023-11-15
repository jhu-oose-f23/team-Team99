import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { PutUser, fetchUser } from "../../api";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button, TextInput } from "react-native-paper";



const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f7f8fa",
    },

    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },

    userInfo: {
      alignItems: "flex-end",
      marginBottom: 20,
    },
    userDetail: {
      fontSize: 18,
      marginBottom: 5,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },

    section: {
      marginBottom: 15,
    },

    button: {
        marginTop: 5,
        marginBottom: 50,
        borderRadius: 5,
        backgroundColor: "skyblue",
        alignSelf: "center",

      },
    
    dropdown: {
      backgroundColor: "#eee",
      padding: 20,
      borderRadius: 5,
    },
    tableHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    tableHeaderCell: {
      flex: 1,
      textAlign: "center",
      fontWeight: "bold",
      color: "#444",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    cell: {
      textAlign: "center",
      color: "#666",
    },
    loadingText: {
      textAlign: "center",
      fontSize: 18,
      marginTop: 20,
    },
  });
  

const EditProfile = ({ route }) => {
    const [user, setUser] = useState({username: ''});
    const [userName, setUserName] = useState('Username')
    const username = route.params.username
    const numKeys = {"weight": "Edit weight", "height": "Edit height"}
    const stringKeys = {"first_name": "Edit first name", "last_name": "Edit last name", 
                         "password": "Edit password", "birthday": "Edit birthday", "frequency": "Edit frequency", "gender": "Edit gender",
                         "preferred_time": "Edit preferred time", "level": "Edit level"}
    const arrayKeys = {"goals": "Edit goals"}


    const handleInputChange = (key, value)=> {
        setUser((user) => ({
            ...user,
            [key]: value,
          }));
    }



    useFocusEffect(
        React.useCallback(() => {
            const getUserData = async () => {
                const usersResponse = await fetchUser(username);
                setUser(usersResponse ? usersResponse : []);
                console.log("the user data", user)
              };
            getUserData();
        }, [username])
      );

    handleSubmit = () => {

        const editUser = async () => {
            const data = PutUser(user);
            console.log("sent data", user)
            if (!data) {
                
              console.log("Accepting connection failed!", data);
            }
          };
          
          editUser()
    }
    

  return (
        <ScrollView style={styles.container}>
            <View
                style={{
                ...styles.userInfo,
                flexDirection: "row",
                alignItems: "center",
                }}
            >
                <Image
                source={require("../../assets/profile.png")}
                style={{
                    width: 100,
                    height: 100,
                    marginRight: 10,
                }}
                />
                <View>
                    <Text
                        style={[
                        styles.userDetail,
                        { fontSize: 20, fontWeight: "bold" },
                        ]}
                    >
                        {user.first_name} {user.last_name}
                    </Text>
                    <Text style={styles.userDetail}>@{user.username}</Text>
                </View>
            </View>

            <View>

            {Object.keys(user).map((key) => (
                key in stringKeys && 
                <View key={key}>
                    <Text style={styles.cell}>{stringKeys[key]}:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={`Enter ${key}`}
                        value={user[key]}
                        onChangeText={(text) => handleInputChange(key, text)}
                    />
                </View>

                

            ))}

            {Object.keys(user).map((key) => (
                key in numKeys &&
                <View key={key}>
                    <Text style={styles.cell}>{numKeys[key]}:</Text>
                    <TextInput
                        style={styles.input}
                        defaultValue={user[key].toString()}
                        keyboardType="numeric"
                        onChangeText={(text) => handleInputChange(key, text)}
                    />
                </View>

            ))}

            </View>

            <Button style={styles.button} onPress={handleSubmit}>Save Edits</Button>
        </ScrollView> 
    );
};



export default EditProfile;
