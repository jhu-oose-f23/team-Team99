import React from "react";
import { WebView } from "react-native-webview";

const Login = ({ navigation, route }) => {
  const { setUserLoggedIn } = route.params;

  const handleWebViewMessage = (event) => {
    // Extracting the message (user uid) sent from the backend
    const userUid = event.nativeEvent.data;
    console.log(userUid);
    setUserLoggedIn(userUid);
  };

  return (
    <WebView
      source={{ uri: "https://jhu-sso-api.onrender.com/jhu/login/" }}
      style={{ marginTop: 20 }}
      onMessage={handleWebViewMessage} // Listening for messages posted from the WebView
    />
  );
};

export default Login;
