const BASE_URL = "https://gymconnectbackend.onrender.com";

const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    return await response.json();
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

export const fetchUser = (username) => fetchData(`user/${username}`);

export const fetchConnections = (username) =>
  fetchData(`connection/${username}`);

export const deleteWorkout = async (workoutId) => {
  console.log(workoutId);
  const apiUrl = `https://gymconnectbackend.onrender.com/workouts/${workoutId}`;
  try {
    const response = await fetch(apiUrl, { method: "DELETE" });
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

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
      console.log(responseData);
      return responseData;
    }
  } catch (error) {
    console.error("Error sending connection request:", error);
  }
};
