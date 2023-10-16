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
