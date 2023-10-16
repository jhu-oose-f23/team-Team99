export const fetchWorkouts = async (username) => {
  const apiUrl = `https://gymconnectbackend.onrender.com/workouts/${username}`;
  try {
    const response = await fetch(apiUrl);
    const responseData = await response.json();
    // Add a unique id to each workout and each exercise so React doesn't complain when rendering a list of workouts
    responseData.map((workout, workoutId) => {
      workout.exercises = workout.exercises.map((exercise, exerciseId) => ({
        ...exercise,
        id: exerciseId,
      }));
      console.log(workout.exercises);
      return {
        ...workout,
        id: workoutId,
      };
    });
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchUser = async (username) => {
  const apiUrl = `https://gymconnectbackend.onrender.com/user/${username}`;
  try {
    const response = await fetch(apiUrl);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchConnections = async (username) => {
  const apiUrl = `https://gymconnectbackend.onrender.com/connection/${username}`;
  try {
    const response = await fetch(apiUrl);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
