import { View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { fetchCalendar } from "../api";
import ScheduleGrid from "./ScheduleGrid";

const Calendar = ({ route }) => {
  const { username } = route.params;
  const [schedule, setSchedule] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchCalendarData() {
        const response = await fetchCalendar(username);
        setSchedule(response.schedule);
      }
      fetchCalendarData();
    }, [])
  );
  console.log(schedule);
  return (
    <View>
      <ScheduleGrid schedule={schedule}></ScheduleGrid>
    </View>
  );
};

export default Calendar;
