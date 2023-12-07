export const navigateToProfile = (navigation, toUsername, fromUsername) => {
  navigation.navigate("Profile", {
    username: toUsername,
    loggedinUser: fromUsername,
  });
};

export const navigateToEdit = (navigation, usedUsername, usedSession) => {
  navigation.navigate("Edit Session", {
      username: usedUsername, 
      session: usedSession,
  });
};