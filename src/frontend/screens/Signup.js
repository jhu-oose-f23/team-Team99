import React, { useContext, useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

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
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setHeight}
        value={height}
        placeholder="Height (in)"
        maxLength={10} //setting limit of input
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setWeight}
        value={weight}
        placeholder="Weight (lbs)"
        maxLength={10} //setting limit of input
      />
      {/* ... other input fields for frequency, gender, etc., with styles.input ... */}
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
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
});

export default Signup;
