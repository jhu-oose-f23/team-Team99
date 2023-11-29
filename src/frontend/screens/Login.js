// import React, { useContext, useState } from "react";
// import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
// import UserContext from "../UserContext";
// const loginApiUrl = "https://gymconnectbackend.onrender.com/user/login";
import { WebView } from "react-native-webview";

const Login = ({ navigation, route }) => {
  return (
    <WebView
      source={{ uri: "https://jhu-sso-api.onrender.com/jhu/login/" }}
      style={{ marginTop: "20%" }}
    />
  );
};

export default Login;
