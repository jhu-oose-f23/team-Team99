import { postUser } from "../api";
import UpsertProfile from "./UpsertProfile";

const Signup = ({ navigation, route }) => {
  return (
    <UpsertProfile
      onSubmitApiCall={postUser}
      username={route.params.username}
      editProfile={false}
    ></UpsertProfile>
  );
};

export default Signup;
