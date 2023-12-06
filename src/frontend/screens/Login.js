import React, { useContext, useEffect } from "react";
import { WebView } from "react-native-webview";
import UserContext from "../UserContext";
import { fetchUser } from "../api";
import * as SecureStore from "expo-secure-store";

const Login = ({ navigation, route }) => {
  const { userLoggedIn } = route.params;
  const { setUserLoggedIn, setUserHasSignedUp } = useContext(UserContext);

  useEffect(() => {
    // Check if user UID is stored in secure storage
    const checkLoginStatus = async () => {
      const storedUserUid = await SecureStore.getItemAsync("userUid");
      if (storedUserUid) {
        setUserLoggedIn(storedUserUid);
        if (fetchUser(storedUserUid)) {
          setUserHasSignedUp(true);
        }
      }
    };
    checkLoginStatus();
  }, []);

  const handleWebViewMessage = async (event) => {
    const userUid = event.nativeEvent.data;
    console.log(userUid);

    // Save user UID to secure storage
    await SecureStore.setItemAsync("userUid", userUid);

    setUserLoggedIn(userUid);
    if (fetchUser(userUid)) {
      setUserHasSignedUp(true);
    }
  };

  console.log("rendering");

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
