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
import { deleteCalendar } from "../../api";
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
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#1a1a1a", // Set header background color
      },
      headerTintColor: "#FFD700", // Set text color
    });
  }, [navigation]);

  const username = route.params.username;
  const [workouts, setWorkouts] = useState([]);
  const { navigate } = useNavigation();

  const times = [
    { label: "12:00 AM", value: 0 },
    { label: "12:30 AM", value: 0.5 },
    { label: "1:00 AM", value: 1 },
    { label: "1:30 AM", value: 1.5 },
    { label: "2:00 AM", value: 2 },
    { label: "2:30 AM", value: 2.5 },
    { label: "3:00 AM", value: 3 },
    { label: "3:30 AM", value: 3.5 },
    { label: "4:00 AM", value: 4 },
    { label: "4:30 AM", value: 4.5 },
    { label: "5:00 AM", value: 5 },
    { label: "5:30 AM", value: 5.5 },
    { label: "6:00 AM", value: 6 },
    { label: "6:30 AM", value: 6.5 },
    { label: "7:00 AM", value: 7 },
    { label: "7:30 AM", value: 7.5 },
    { label: "8:00 AM", value: 8 },
    { label: "8:30 AM", value: 8.5 },
    { label: "9:00 AM", value: 9 },
    { label: "9:30 AM", value: 9.5 },
    { label: "10:00 AM", value: 10 },
    { label: "10:30 AM", value: 10.5 },
    { label: "11:00 AM", value: 11 },
    { label: "11:30 AM", value: 11.5 },
    { label: "12:00 PM", value: 12 },
    { label: "12:30 PM", value: 12.5 },
    { label: "1:00 PM", value: 13 },
    { label: "1:30 PM", value: 13.5 },
    { label: "2:00 PM", value: 14 },
    { label: "2:30 PM", value: 14.5 },
    { label: "3:00 PM", value: 15 },
    { label: "3:30 PM", value: 15.5 },
    { label: "4:00 PM", value: 16 },
    { label: "4:30 PM", value: 16.5 },
    { label: "5:00 PM", value: 17 },
    { label: "5:30 PM", value: 17.5 },
    { label: "6:00 PM", value: 18 },
    { label: "6:30 PM", value: 18.5 },
    { label: "7:00 PM", value: 19 },
    { label: "7:30 PM", value: 19.5 },
    { label: "8:00 PM", value: 20 },
    { label: "8:30 PM", value: 20.5 },
    { label: "9:00 PM", value: 21 },
    { label: "9:30 PM", value: 21.5 },
    { label: "10:00 PM", value: 22 },
    { label: "10:30 PM", value: 22.5 },
    { label: "11:00 PM", value: 23 },
    { label: "11:30 PM", value: 23.5 },
  ];

  const getTime = (string_time) => {
    const entry = times.find((dict) => dict.value === string_time);
    console.log("the entry is", entry.label);
    return entry.label;
  };

  const deleteWorkout = async (session) => {
    const status1 = await deleteCalendar(username, session);

    console.log("The status is", status1);

    const newWorkout = workouts.filter((item) => item !== session);
    setWorkouts(newWorkout);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchCalendarData = async () => {
        const userResponse = await fetchCalendar(username);
        const workout = userResponse.schedule;
        const name = userResponse.username;
        setWorkouts(workout ? workout : []);
      };

      fetchCalendarData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {workouts &&
        workouts.map((session, index) => (
          <TouchableOpacity
            onPress={() => navigateToEdit(navigation, username, session)}
            style={styles.userContainer}
            key={index}
          >
            <Image
              source={require("../../assets/exercise_logo.png")}
              style={styles.profileImage}
            />
            <View style={styles.textStyle}>
              <Text style={styles.workoutName}>{ session.name} </Text>
              <Text style={styles.username}>{ session.day}  </Text>
              <Text style={styles.username}>
                {
                  getTime(session.start_hour) +
                  " - " +
                  getTime(session.end_hour)}
              </Text>
            </View>
            <View>
              <Button onPress={() => deleteWorkout(session)} textColor="#FFD700">Delete</Button>
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
    backgroundColor: "#1a1a1a",
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
    color: 'white',
  },
  workoutName: {
    color: '#FFD700',
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
