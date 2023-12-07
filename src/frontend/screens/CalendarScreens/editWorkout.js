import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import Profile from "../assets/profile.png";
import { Button } from "react-native-paper";
import { navigateToEdit } from "../../Helpers";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  fetchConnections,
  fetchConnectionRequest,
  PutConnectionRequest,
  fetchUser,
  fetchAllUsers,
  fetchWorkouts,
  deleteConnection,
  fetchCalendar,
  removeExistingConnection,
} from "../../api";

const EditWorkout = ({ route, navigation }) => {
  const username = route.params.username;
  const [workouts, setWorkouts] = useState([])
  const {navigate} = useNavigation()

//   const navigateToEdit = (session) => {
//     navigation.navigate("Edit Session", {
//         username: username, 
//         session: session,
//     })
//   }

//   const formattedTime = new Intl.DateTimeFormat('en-US', {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true, // Set to false for 24-hour format
//   }).format(calendarTime);

  useFocusEffect(
    React.useCallback(() => {

        const fetchCalendarData = async () => {
            const userResponse = await fetchCalendar(username)
            const workout = userResponse.schedule
            const name = userResponse.username
            setWorkouts(workout ? workout: []);
            console.log("workouts are", workouts)
            console.log("The username is", name)
        }

      fetchCalendarData()
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {workouts &&
        workouts.map((session, index) => (
          <TouchableOpacity
            onPress={() =>
              navigateToEdit(navigation, username, session)
            }
            style={styles.userContainer}
            key={index}
          >
            <Image
              source={require("../../assets/exercise_logo.png")}
              style={styles.profileImage}
            />
            <View style={styles.textStyle}>
              <Text style={styles.username}>{"Title: " + session.name}</Text>
              <Text style={styles.username}>{"Time: " + session.start_hour + " - " + session.date}</Text>
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

export default EditWorkout;

