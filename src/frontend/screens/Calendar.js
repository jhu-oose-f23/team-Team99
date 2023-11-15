import { View, Text } from "react-native";

const Calendar = ({ route }) => {
  const { username } = route.params;
  return (
    <View>
      <Text>Calendar</Text>
    </View>
  );
};

export default Calendar;
