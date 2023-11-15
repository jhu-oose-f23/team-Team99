// TODO: make this a .env variable
const BASE_URL = "https://gymconnectbackend.onrender.com";

export const fetchConnectionRequestSource = async (src) => {
  const connectionRequests = await fetchData(`connection/request/out/${src}`);
  return connectionRequests;
};

const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchWorkouts = async (username) => {
  const workouts = await fetchData(`workouts/${username}`);

  return workouts.map((workout, workoutId) => ({
    ...workout,
    exercises: workout.exercises.map((exercise, exerciseId) => ({
      ...exercise,
      id: exerciseId,
    })),
  }));
};

export const createWorkout = async (workout) => {
  const response = await fetch(
    "https://gymconnectbackend.onrender.com/workouts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
    }
  );
  await response.json();
};

export const deleteWorkout = async (workoutId) => {
  const apiUrl = `https://gymconnectbackend.onrender.com/workouts/${workoutId}`;
  try {
    const response = await fetch(apiUrl, { method: "DELETE" });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchUser = (username) => fetchData(`user/${username}`);

export const fetchConnections = (username) =>
  fetchData(`connection/${username}`);

export const fetchRecommendations = async (username) => {
  try {
    const recommendations = await fetchData(`user/recommendations/${username}`);
    // recommendations.map((userData, index) => {
    //   console.log(userData);
    // });
    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }
};

export const postConnectionRequest = async (source, dest) => {
  const apiUrl = `https://gymconnectbackend.onrender.com/connection/request`;
  const requestBody = {
    source: source,
    dest: dest,
  };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const responseData = await response.json();
    if (response.status === 422) {
      console.error("Validation Error:", responseData.errors);
    } else {
      return responseData;
    }
  } catch (error) {
    console.error("Error sending connection request:", error);
  }
};

export const fetchLeaderboardList = async () => {
  try {
    const leaderboardList = await fetchData(`workouts/leaderboard`);
    const transformedLeaderboardList = leaderboardList.map((item, index) => ({
      id: index,
      name: item,
      icon: "trophy",
    }));
    // console.log(transformedLeaderboard);
    return transformedLeaderboardList;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
};

export const fetchLeaderboard = async (exercise) => {
  try {
    const leaderboard = await fetchData(`workouts/leaderboard/${exercise}`);
    const transformedLeaderboard = leaderboard.map((item, index) => ({
      username: item[0],
      score: item[1],
    }));
    // console.log(transformedLeaderboard);
    return transformedLeaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
};

export const fetchConnectionRequest = (dst) => {
  return fetchData(`connection/request/${dst}`);
};

export const fetchAllUsers = () => fetchData("user");

export const deleteConnection = async (source, dst) => {
  const apiURL = `https://gymconnectbackend.onrender.com/connection/request`;

  const requestBody = {
    source: source,
    dest: dst,
  };

  const response = await fetch(apiURL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (response.status == 200) {
    return response.json();
  } else {
    console.error("Rejecting connection failed!!", response.status);
    return 0;
  }
};

export const PutConnectionRequest = async (source, dst) => {
  const apiURL = `https://gymconnectbackend.onrender.com/connection/request`;

  const requestBody = {
    source: source,
    dest: dst,
  };

  const response = await fetch(apiURL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (response.status == 200) {
    return response.json();
  } else {
    console.error("Accepting connection failed!!", response.status);
    return 0;
  }
};

export const createIssue = async (issue) => {
  const response = await fetch("https://gymconnectbackend.onrender.com/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(issue),
  });
  await response.json();
};

// Calendar API
export const fetchCalendar = async (username) => {
  const calendar = await fetchData(`calendar/${username}`);
  return calendar;
};

// Calendar is an object like
// {
//   "schedule": [
//       {"day": "Sunday",  "end_hour": 12, "name": "cardio", "start_hour": 10.5},
//       {"day": "Monday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
//       {"day": "Tuesday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
//      {"day": "Wednesday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
//     {"day": "Thursday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
//     {"day": "Friday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
//     {"day": "Saturday", "end_hour": 12, "name": "cardio", "start_hour": 10.5}
// ]
// “username”: “k1”
// }
export const updateCalendar = async (username, calendar) => {
  console.log(`${BASE_URL}/calendar/${username}`);
  const response = await fetch(`${BASE_URL}/calendar/${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(calendar),
  });
  console.log(JSON.stringify(calendar));
  const res = await response.json();
  console.log(res);
};
