const BASE_URL = "https://gymconnectbackend.onrender.com";

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

export const fetchUser = (username) => fetchData(`user/${username}`);

export const fetchConnections = (username) =>
  fetchData(`connection/${username}`);
