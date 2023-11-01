export const navigateToProfile = (navigation, toUsername, fromUsername) => {
  navigation.navigate("Profile", {
    username: toUsername,
    loggedinUser: fromUsername,
  });
};
