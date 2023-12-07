import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

const UpsertProfile = ({
  navigation,
  username,
  onSubmitApiCall,
  editProfile,
}) => {
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

  const [level, setLevel] = useState("");
  const [levelOptions, setLevelOptions] = useState([
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ]);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);

  const [goalOptions, setGoalOptions] = useState([
    { label: "Meet people", value: "Meet people" },
    { label: "Build muscle", value: "Build muscle" },
    { label: "Get stronger", value: "Get stronger" },
    { label: "Lose weight", value: "Lose weight" },
    { label: "Build endurance", value: "Build endurance" },
  ]);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goals, setGoals] = useState([]);

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

    // Only validate if creating profile; don't validate if editing profile
    if (
      !editProfile &&
      Object.values(userDetails).some((value) => value === "")
    ) {
      alert("Please fill out all the fields");
      return;
    }
    if (editProfile) {
      // Remove all empty fields
      Object.keys(userDetails).forEach(
        (key) =>
          (userDetails[key] === "" || userDetails[key].length === 0) &&
          delete userDetails[key]
      );
    }

    await onSubmitApiCall(userDetails);
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {!editProfile && (
            <>
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
            </>
          )}
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
              dropDownDirection="BOTTOM"
              placeholderStyle={{
                color: "#C7C7CD",
                marginBottom: 8,
                textAlign: "center",
                marginLeft: 30,
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
              dropDownDirection="BOTTOM"
              placeholderStyle={{
                color: "#C7C7CD",
                marginBottom: 8,
                textAlign: "center",
                marginLeft: 30,
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
              dropDownDirection="BOTTOM"
              placeholderStyle={{
                color: "#C7C7CD",
                marginBottom: 8,
                textAlign: "center",
                marginLeft: 30,
              }}
              dropDownContainerStyle={styles.dropdown}
              containerStyle={{
                maxHeight: 2000,
              }}
            />
          </View>
          <View style={{ zIndex: 40, alignItems: "center" }}>
            <Text style={{ marginRight: "60%" }}>Level</Text>
            <DropDownPicker
              open={levelDropdownOpen}
              listMode="SCROLLVIEW"
              value={level}
              items={levelOptions}
              setOpen={setLevelDropdownOpen}
              setValue={(v) => setLevel(v())}
              placeholder="Level"
              style={styles.dropdown}
              dropDownDirection="BOTTOM"
              placeholderStyle={{
                color: "#C7C7CD",
                marginBottom: 8,
                textAlign: "center",
                marginLeft: 30,
              }}
              dropDownContainerStyle={styles.dropdown}
              containerStyle={{
                maxHeight: 2000,
              }}
            />
          </View>
          <View style={{ zIndex: 20, alignItems: "center" }}>
            <Text style={{ marginRight: "60%" }}>Goals</Text>
            <DropDownPicker
              open={goalDropdownOpen}
              multiple={true}
              multipleText={`${goals.length} goal${
                goals.length > 1 ? "s" : ""
              } selected`}
              listMode="SCROLLVIEW"
              value={goals}
              items={goalOptions}
              setOpen={setGoalDropdownOpen}
              setValue={setGoals}
              placeholder="Goal"
              dropDownDirection="BOTTOM"
              style={styles.dropdown}
              placeholderStyle={{
                color: "#C7C7CD",
                marginBottom: 8,
                textAlign: "center",
                marginLeft: 30,
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
          {!editProfile && (
            <>
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
            </>
          )}

          {/* ... add labels and input fields for frequency, gender, etc., similar to above ... */}
          <View style={{ marginBottom: 400 }}>
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30%",
  },
  dropdown: {
    width: "80%",
    alignSelf: "center",
    marginTop: 1,
    margin: 20,
  },
  input: {
    width: "80%", // Adjust width as needed
    height: 50, // Adjust height as needed
    marginTop: 1,
    margin: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlign: "left",
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

export default UpsertProfile;
