Backend Server running at base url: https://gymconnectbackend.onrender.com

Basic documentation found at https://gymconnectbackend.onrender.com/swagger-ui (see here for request schemas)

**Endpoints**

GET /workouts -- Provides list of all workouts in database as list of dictionaries. Sample response is below:
    
    [
      {
          "day": "2023-09-30",
          "exercises": [
              {
                  "name": "bench",
                  "reps": 10,
                  "sets": 3
              },
              {
                  "name": "squat",
                  "reps": 10,
                  "sets": 3
              },
              {
                  "name": "deadlift",
                  "reps": 10,
                  "sets": 3
              }
          ],
          "id": 31,
          "time": "21:28:32.835832+00",
          "workout_name": "Leg day"
      },
      {
          "day": "2023-09-30",
          "exercises": [
              {
                  "name": "bench",
                  "reps": 10,
                  "sets": 3
              },
              {
                  "name": "squat",
                  "reps": 10,
                  "sets": 3
              },
              {
                  "name": "deadlift",
                  "reps": 10,
                  "sets": 3
              }
          ],
          "id": 32,
          "time": "21:39:36.160359+00",
          "workout_name": "Leg day"
      }
    ]
  
POST /workouts: Creates a new workout in database. Sample request body is below:

    {
    "workout_name": "Leg day",
    "exercises": [
        {
            "name": "bench",
            "reps": 10,
            "sets": 3
        },
        {
            "name": "squat",
            "reps": 10,
            "sets": 3
        },
        {
            "name": "deadlift",
            "reps": 10,
            "sets": 3
        }
      ]
    }

DELETE /workouts: Deletes ALL workouts in database (this is more for testing and development purposes)

**NOTES**

API is hosted as a free instance on Render, so spins down with inactivity. As a result, when request is made to the API when it has spun down, it takes an extra minute or so to spin up and provide that first response. This is NOT a bug or malfunction.

The values inside the _list_ provided for "exercises" in request body must be dictionaries, but the dictionaries themselves can have any key-value pairs in them (ie. could add a "weight":"50" k-v pair if desired).
