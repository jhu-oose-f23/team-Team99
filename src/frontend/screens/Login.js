import React, { useContext, useEffect } from "react";
import { WebView } from "react-native-webview";
import UserContext from "../UserContext";
import { fetchUser } from "../api";

const Login = ({ navigation, route }) => {
  const { userLoggedIn } = route.params;
  const { setUserLoggedIn, setUserHasSignedUp } = useContext(UserContext);

  useEffect(() => {
    // This code runs when `userLoggedIn` changes.
    // You can add any operations here that should happen when `userLoggedIn` changes.
    // For example, fetching user data or updating the state.
  }, [userLoggedIn]);

  const handleWebViewMessage = (event) => {
    // Extracting the message (user uid) sent from the backend
    const userUid = event.nativeEvent.data;
    console.log(userUid);
    setUserLoggedIn(userUid);

    // Check if the user has signed up
    if (fetchUser(userUid)) {
      setUserHasSignedUp(true);
    }
  };
  console.log("rendering");

  return (
    <WebView
      key={userLoggedIn} // This is to force the WebView to rerender when `userLoggedIn` changes
      source={{ uri: "https://jhu-sso-api.onrender.com/jhu/login/" }}
      style={{ marginTop: 20 }}
      onMessage={handleWebViewMessage} // Listening for messages posted from the WebView
    />
  );
};

export default Login;
