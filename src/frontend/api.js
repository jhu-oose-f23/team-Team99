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

export const fetchPostsFeed = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/post/feed/${username}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

export const fetchUserPosts = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/post/${username}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching user posts");
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

export const fetchWorkoutDetails = async (id) => {
  // console.log(id);
  try {
    const response = await fetch(`${BASE_URL}/workouts/id/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
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

export const fetchLeaderboardUser = async (exercise, user) => {
  try {
    const leaderboard = await fetchData(
      `workouts/leaderboard/${exercise}/${user}`
    );
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

export const removeExistingConnection = async (usr1, usr2) => {
  const apiURL = `https://gymconnectbackend.onrender.com/connection`;

  const requestBody = {
    user1: usr1,
    user2: usr2,
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
    console.error("Deleting connection failed!!", response.status);
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

export const postUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (response.status == 200) {
    return response.json();
  } else {
    console.error("Accepting connection failed!!", response.status);
    return 0;
  }
};

export const PutUser = async (new_data) => {
  console.log(JSON.stringify(new_data));
  const apiURL = "https://gymconnectbackend.onrender.com/user";

  const response = await fetch(apiURL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(new_data),
  });

  if (response.status == 200) {
    return response.json();
  } else {
    console.error("Updating the user failed!!", response.status);
    return 0;
  }
};

export const createIssue = async (issue, username) => {
  const response = await fetch("https://gymconnectbackend.onrender.com/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      body: issue,
    }),
  });
  const res = await response.json();
  return res;
};

// Calendar API
export const fetchCalendar = async (username) => {
  const calendar = await fetchData(`calendar/${username}`);
  return calendar;
};


export const updateCalendar = async (username, calendar) => {
  const response = await fetch(`${BASE_URL}/calendar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(calendar),
  });
  if (response.status === 404) {
    return 404;
  }
  try {
    const res = await response.json();
    return res;
  } catch (e) {
    console.log(e);
  }
};


export const deleteCalendar = async (username, session) => {
  const apiUrl = `https://gymconnectbackend.onrender.com/calendar`;
  const new_session = [session]
  console.log("the username is", username)
  try {
    const response = await fetch(apiUrl, { 
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": username,
        "schedule": new_session
      })
    });
    const responseData = await response.json();
    console.log("The response is", responseData)
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const createPost = async (username, postBody, selectedWorkoutID) => {
  try {
    const requestBody = {
      username: username,
      body: postBody,
    };

    if (selectedWorkoutID !== -1) {
      requestBody.workout_id = selectedWorkoutID;
    }

    const response = await fetch(`${BASE_URL}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error creating post");
  }
};

