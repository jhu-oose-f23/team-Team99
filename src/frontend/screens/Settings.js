import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../constants/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { createIssue } from "../api";
import { Snackbar } from "react-native-paper";
import { useContext } from "react";
import UserContext from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const Settings = ({ route }) => {
  const { username } = route.params;
  const { setUserLoggedIn, setUserHasSignedUp } = useContext(UserContext);

  const { navigate } = useNavigation();

  const navigateToEditProfile = () => {
    navigate("Edit Profile");
  };

  const logout = async () => {
    console.log("logging out");
    const res = await fetch("https://jhu-sso-api.onrender.com/jhu/logout/");
    const data = await res.json();
    console.log("logged out");
    console.log(data);
    await logout();
    setUserLoggedIn("");
    setUserHasSignedUp(false);
  };
  // Snackbar
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const onDismissSnackBar = () => setVisibleSnackbar(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [issue, setIssue] = useState("");
  const handleSubmit = async () => {
    setIssue("");
    setModalVisible(!modalVisible);
    setVisibleSnackbar(true);
    const res = await createIssue(issue, username);
  };
  const renderReportModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Report an Issue</Text>
          <TextInput
            placeholder="Describe the issue"
            style={styles.textInput}
            onChangeText={setIssue}
            value={issue}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const accountItems = [
    {
      icon: "person-outline",
      text: "Edit Profile",
      action: navigateToEditProfile,
    },
  ];

  const actionsItems = [
    {
      icon: "outlined-flag",
      text: "Report an Issue",
      action: () => setModalVisible(true),
    },
    { icon: "logout", text: "Log out", action: logout },
  ];

  const renderSettingsItem = ({ icon, text, action }) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
      }}
    >
      <MaterialIcons name={icon} size={24} />
      <Text
        style={{
          marginLeft: 36,
          ...FONTS.semiBold,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView style={{ marginHorizontal: 12 }}>
        {/* Account Settings */}
        <View>
          <View
            style={{
              borderRadius: 12,
            }}
          >
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Actions Settings */}

        <View style={{ marginBottom: 12 }}>
          <View style={{ borderRadius: 12 }}>
            {actionsItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>
        {renderReportModal()}
      </ScrollView>
      <Snackbar
        wrapperStyle={{ top: "100%" }}
        visible={visibleSnackbar}
        onDismiss={onDismissSnackBar}
        duration={2000}
      >
        Issue submitted successfully
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    ...FONTS.semiBold, // assuming this is defined in your FONTS constant
  },
  textInput: {
    height: 100,
    width: "100%",
    borderColor: COLORS.gray2, // assuming this is defined in your COLORS constant
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    ...FONTS.regular, // assuming this is defined in your FONTS constant
    textAlignVertical: "top",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: COLORS.primary, // assuming this is defined in your COLORS constant
  },
  buttonText: {
    color: "white",
    ...FONTS.bold, // assuming this is defined in your FONTS constant
    textAlign: "center",
  },
});

export default Settings;
