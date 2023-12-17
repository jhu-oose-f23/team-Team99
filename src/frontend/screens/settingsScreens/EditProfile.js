import React, { useLayoutEffect } from "react";
import { PutUser } from "../../api";
import UpsertProfile from "../UpsertProfile";

const EditProfile = ({ navigation, route }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#1a1a1a", // Set header background color
      },
      headerTintColor: "#FFD700", // Set text color
    });
  }, [navigation]);
  return (
    
    <UpsertProfile
      onSubmitApiCall={PutUser}
      username={route.params.username}
      editProfile={true}
    ></UpsertProfile>
  );
};

export default EditProfile;
