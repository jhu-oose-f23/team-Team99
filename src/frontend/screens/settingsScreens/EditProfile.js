import { PutUser } from "../../api";
import UpsertProfile from "../UpsertProfile";

const EditProfile = ({ navigation, route }) => {
  return (
    <UpsertProfile
      onSubmitApiCall={PutUser}
      username={route.params.username}
      editProfile={true}
    ></UpsertProfile>
  );
};

export default EditProfile;
