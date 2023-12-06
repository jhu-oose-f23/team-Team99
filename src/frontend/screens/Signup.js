import React, { useContext, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import UserContext from "../UserContext";
import { postUser } from "../api";

const Signup = ({ navigation, route }) => {
  const username = route.params.username;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [frequency, setFrequency] = useState("");
  const [frequencyOptions, setFrequencyOptions] = useState([
    { label: "Daily", value: "Daily" },
    { label: "3-4 times a week", value: "3-4 times a week" },
    { label: "1 time a week", value: "1 time a week" },
  ]);
  const [frequencyDropdownOpen, setFrequencyDropdownOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [genderOptions, setGenderOptions] = useState([
    { label: "Woman", value: "Woman" },
    { label: "Man", value: "Man" },
    { label: "Transgender", value: "Transgender" },
    { label: "Non-binary/non-conforming", value: "Non-binary/non-conforming" },
    { label: "Prefer not to respond", value: "Prefer not to respond" },
  ]);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);

  const [preferredTime, setPreferredTime] = useState("");
  const [preferredTimeOptions, setPreferredTimeOptions] = useState([
    { label: "Morning", value: "Morning" },
    { label: "Afternoon", value: "Afternoon" },
    { label: "Evening", value: "Evening" },
    { label: "Night", value: "Night" },
  ]);
  const [preferredTimeDropdownOpen, setPreferredTimeDropdownOpen] =
    useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goals, setGoals] = useState([]);
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

      <View style={{ zIndex: 1000, alignItems: "center" }}>
        <Text style={{ marginRight: "50%" }}>Frequency</Text>
        <DropDownPicker
          open={frequencyDropdownOpen}
          listMode="SCROLLVIEW"
          value={frequency}
          items={frequencyOptions}
          setOpen={setFrequencyDropdownOpen}
          setValue={(v) => setFrequency(v())}
          placeholder="Frequency"
          style={styles.dropdown}
          placeholderStyle={{
            color: "#C7C7CD",
            marginBottom: 8,
          }}
          dropDownContainerStyle={{ ...styles.dropdown, zIndex: 1000 }}
          containerStyle={{
            maxHeight: 2000,
          }}
        />
      </View>

      <View style={{ zIndex: 100, alignItems: "center" }}>
        <Text style={{ marginRight: "55%" }}>Gender</Text>
        <DropDownPicker
          open={genderDropdownOpen}
          listMode="SCROLLVIEW"
          value={gender}
          items={genderOptions}
          setOpen={setGenderDropdownOpen}
          setValue={(v) => setGender(v())}
          placeholder="Gender"
          style={styles.dropdown}
          placeholderStyle={{
            color: "#C7C7CD",
            marginBottom: 8,
          }}
          dropDownContainerStyle={styles.dropdown}
          containerStyle={{
            maxHeight: 2000,
          }}
        />
      </View>
      <View style={{ zIndex: 50, alignItems: "center" }}>
        <Text style={{ marginRight: "45%" }}>Preferred Time</Text>
        <DropDownPicker
          open={preferredTimeDropdownOpen}
          listMode="SCROLLVIEW"
          value={preferredTime}
          items={preferredTimeOptions}
          setOpen={setPreferredTimeDropdownOpen}
          setValue={(v) => setPreferredTime(v())}
          placeholder="Preferred Time"
          style={styles.dropdown}
          placeholderStyle={{
            color: "#C7C7CD",
            marginBottom: 8,
          }}
          dropDownContainerStyle={styles.dropdown}
          containerStyle={{
            maxHeight: 2000,
          }}
        />
      </View>

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
  dropdown: {
    width: "80%",
    alignSelf: "center",
    marginTop: 1,
    margin: 5,
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
    backgroundColor: "white",
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
