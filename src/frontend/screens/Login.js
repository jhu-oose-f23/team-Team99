import React, { useContext, useEffect } from "react";
import { WebView } from "react-native-webview";
import UserContext from "../UserContext";
import { fetchUser } from "../api";
import * as SecureStore from "expo-secure-store";

const Login = ({ navigation, route }) => {
  const { userLoggedIn } = route.params;
  const { setUserLoggedIn, setUserHasSignedUp } = useContext(UserContext);

  const handleWebViewMessage = async (event) => {
    const userUid = event.nativeEvent.data;
    // Save user UID to secure storage
    await SecureStore.setItemAsync("userUid", userUid);

    setUserLoggedIn(userUid);
    const res = await fetchUser(userUid);
    if (res.code !== 400) {
      console.log("user fetched ");
      setUserHasSignedUp(true);

    }
  };

  return (
    <WebView
      key={userLoggedIn}
      source={{ uri: "https://jhu-sso-api.onrender.com/jhu/login/" }}
      style={{ marginTop: 20 }}
      onMessage={handleWebViewMessage}
    />
  );
};

export default Login;
