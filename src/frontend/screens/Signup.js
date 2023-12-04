import React, { useContext, useState } from "react";
import { View, TextInput, Button } from "react-native";

import UserContext from "../UserContext";

const Signup = ({ navigation, route }) => {
  const username = route.params.username;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [frequency, setFrequency] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goals, setGoals] = useState([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [level, setLevel] = useState("");

  const { setUserHasSignedUp } = useContext(UserContext);

  const handleSubmit = () => {
    const userDetails = {
      first_name: firstName,
      last_name: lastName,
      username: username,
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
    console.log(userDetails);
    setUserHasSignedUp(true);
  };

  return (
    <View>
      <TextInput placeholder="First Name" onChangeText={setFirstName} />
      <TextInput placeholder="Last Name" onChangeText={setLastName} />
      <TextInput placeholder="Birthdate" onChangeText={setBirthdate} />
      {/* ... other input fields for frequency, gender, etc. ... */}
      <Button title="Sign Up" onPress={handleSubmit} />
    </View>
  );
};

export default Signup;
