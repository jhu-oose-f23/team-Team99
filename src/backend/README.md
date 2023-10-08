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

POST /user: add new user to the database. Sample request body is below:

    {
        "first_name": "Kyler",
        "last_name": "Murray",
        "username": "k4",
        "password": "cardinals",
        "birthdate": "09-08-2003",
        "frequency": "Daily",
        "gender": "M",
        "height": 72,
        "weight": 170,
        "goals": ["lose weight", "build muscle"],
        "preferred_time": "Morning",
        "level": "Beginner"
    }

GET /user: get all users. Sample response below:

    [
        {
            "first_name": "Kyler",
            "id": "52b1e2fe-a18c-43bd-9f95-25781046a553",
            "last_name": "Murray",
            "username": "k3"
        },
        {
            "first_name": "Kyler",
            "id": "5687552b-b2b3-4354-a0e6-babf7bd73939",
            "last_name": "Murray",
            "username": "k1"
        },
        {
            "first_name": "Kyler",
            "id": "3ce4af4b-7774-418f-b39c-364ac6ea231e",
            "last_name": "Murray",
            "username": "k2"
        }
    ]

GET /user/_username_: get specific user with username. Example: /user/k6

Sample response below:

    {
        "birthdate": "2003-09-08",
        "first_name": "Kyler",
        "frequency": "Daily",
        "gender": "M",
        "goals": [
            "lose weight",
            "build muscle"
        ],
        "height": 72,
        "id": "32c7af63-7a19-4be0-a4e6-334ff9fd79c4",
        "last_name": "Murray",
        "level": "Beginner",
        "password": "cardinals",
        "preferred_time": "Morning",
        "username": "k6",
        "weight": 170
    }

POST /user/login: login a specific user. Sample request body and response below:

    {    
        "username": "k1",
        "password": "cardinals"
    }

    {
        "first_name": "Kyler",
        "id": "5687552b-b2b3-4354-a0e6-babf7bd73939",
        "last_name": "Murray",
        "username": "k1"
    }

**NOTES**

Server is hosted as a free instance on Render, so spins down with inactivity. As a result, when request is made to the API when server has spun down, it takes an extra minute or so to spin up and provide that first response. This is NOT a bug or malfunction.

The values inside the _list_ provided for "exercises" in request body must be dictionaries, but the dictionaries themselves can have any key-value pairs in them (ie. could add a "weight":"50" k-v pair if desired).
