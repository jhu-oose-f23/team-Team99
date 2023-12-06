import React, { useContext, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import UserContext from "../UserContext";
import { postUser } from "../api";

const Signup = ({ navigation, route }) => {
  const username = route.params.username;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [frequency, setFrequency] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goals, setGoals] = useState([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [level, setLevel] = useState("");

  const { setUserHasSignedUp } = useContext(UserContext);

  const handleSubmit = async () => {
    const userDetails = {
      first_name: firstName,
      last_name: lastName,
      username,
      password: "password",
      birthdate,
      frequency,
      gender,
      height,
      weight,
      goals,
      preferred_time: preferredTime,
      level,
    };
    // Process the signup logic here
    await postUser(userDetails);
    setUserHasSignedUp(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Height (in)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setHeight}
        value={height}
        placeholder="Height (in)"
        maxLength={10}
      />

      <Text style={styles.label}>Weight (lbs)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setWeight}
        value={weight}
        placeholder="Weight (lbs)"
        maxLength={10}
      />

      <Text style={styles.label}>Birth Date</Text>
      <View style={styles.input}>
        <DateTimePicker
          testID="dateTimePicker"
          value={birthdate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || birthdate;
            setOpen(false);
            setBirthdate(currentDate);
          }}
        />
      </View>

      {/* ... add labels and input fields for frequency, gender, etc., similar to above ... */}

      <Button title="Sign Up" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%", // Adjust width as needed
    height: 50, // Adjust height as needed
    marginTop: 1,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 1,
    width: "80%", // Adjust width as needed
    height: 50, // Adjust height as needed
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  label: {
    marginRight: "50%",
    marginBottom: 0,
  },
});

export default Signup;
