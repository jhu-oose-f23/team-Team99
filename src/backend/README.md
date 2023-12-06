Backend Server running at base url: https://gymconnectbackend.onrender.com

Basic documentation found at https://gymconnectbackend.onrender.com/swagger-ui (see here for request schemas)

**Endpoints**

GET /workouts -- Provides list of all workouts in database as list of dictionaries. Sample response is below:

    [
    {
        "day": "2023-10-15",
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
            }
        ],
        "id": 133,
        "time": "16:36:23.805503+00",
        "user": "k1",
        "workout_name": "Leg day"
    },
    {
        "day": "2023-10-15",
        "exercises": [
            {
                "name": "bench",
                "reps": 10,
                "sets": 3
            }
        ],
        "id": 133,
        "time": "16:36:23.805503+00",
        "user": "k1",
        "workout_name": "Leg day"
    }
    ]

POST /workouts: Creates a new workout in database. Sample request body is below:

    {
    "workout_name": "Leg day",
    "user": "k2",
    "exercises": [
        {
            "name": "bench",
            "reps": 10,
            "sets": 3,
        },
        {
            "name": "squat",
            "reps": 10,
            "sets": 3
        }
    ]
    }

DELETE /workouts: Deletes ALL workouts in database (this is more for testing and development purposes)

GET /workouts/username: Get workouts for a specific user (example: /workouts/k1). Sample response:

    [
        {
            "day": "2023-10-15",
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
                }
            ],
            "id": 133,
            "time": "16:36:23.805503+00",
            "user": "k1",
            "workout_name": "Leg day"
        },
        {
            "day": "2023-10-15",
            "exercises": [
                {
                    "name": "bench",
                    "reps": 10,
                    "sets": 3
                }
            ],
            "id": 134,
            "time": "16:40:04.644814+00",
            "user": "k1",
            "workout_name": "Leg day"
        }
    ]

GET /workouts/leaderboard: get all the exercises that appear in any workout. Sample response:

    [
        "squat", 
        "bench press", 
        skullcrushers"
    ]

GET /workouts/leaderboard/exercise (example /workouts/leaderboard/skullcrushers). Sample response:

    [
        [
            "k1",
            300
        ],
        [
            "ud40",
            300
        ],
        [
            "travis",
            300
        ],
        [
            "dhop",
            70
        ],
        [
            "tswift",
            70
        ]
    ]

GET /workouts/leaderboard/exercise/username (example /workouts/leaderboard/skullcrushers/k1) 
Provides a leaderboard for this user and exercise, with only users in same weight class. Sample response:

    [
        [
            "k1",
            300
        ],
        [
            "travis",
            300
        ],
        [
            "dhop",
            70
        ]
    ]

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

PUT /user: Update a user's profile. Same Schema as POST /user

GET /user: get all users. Sample response below:

    [
        {
            "first_name": "Kyler",
            "last_name": "Murray",
            "username": "k3"
        },
        {
            "first_name": "Kyler",
            "last_name": "Murray",
            "username": "k1"
        },
        {
            "first_name": "Kyler",
            "last_name": "Murray",
            "username": "k2"
        }
    ]

GET /user/username: get specific user with username. Example: /user/k1

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
        "last_name": "Murray",
        "level": "Advanced",
        "password": "cardinals",
        "preferred_time": "Morning",
        "username": "k1",
        "weight": 170
    }

POST /user/login: login a specific user. Sample request body and response below:

    {    
        "username": "k1",
        "password": "cardinals"
    }

    {
        "first_name": "Kyler",
        "last_name": "Murray",
        "username": "k1"
    }

GET /user/recommendations/username: get connection recommendations for a particular user (example: /user/recommendations/k1). Sample response below. Provides percent match, top5 matches in descending order.

    [
        {
            "percent": 92.3076923076923,
            "username": "k5"
        },
        {
            "percent": 84.61538461538461,
            "username": "k2"
        },
        {
            "percent": 76.92307692307693,
            "username": "k3"
        },
        {
            "percent": 61.53846153846154,
            "username": "l_james"
        },
        {
            "percent": 61.53846153846154,
            "username": "k6"
        }
    ]

POST /connection/request: Make a connection request from source to destination user. Works as long as not already connected, the request doesn't already exist, and destination doesn't have a request to connect already with the source. Sample request body:

    {
        "source": "k2",
        "dest": "k3"
    }

PUT /connection/request: Accept a connection request from source to destination. Same format as POST to same endpoint. Sample request body below:

    {
        "source": "k2",
        "dest": "k3"
    }    

DELETE /connection/request: Delete a connection request from source to destination. Effectively "decline" a request. Sample request body below:

    {
        "source": "k6",
        "dest": "k1"
    }

GET /connection/request/username: Get all the incoming connection requests for a user. Example: /connection/request/k3. Sample response body (list) below.

    [
        "k2",
        "k1"
    ]

GET /connection: check if two users are connected. Sample request and response bodies below.

    {
        "user1": "k2",
        "user2": "k1"
    }

    False

DELETE /connection: delete the connection between two users, if they are connected. Sample request body below. Doesn't matter which user is 1 and which is 2.

    {
        "user1": "k2",
        "user2": "k1"
    }

GET /connection/username: provide all the connections of a given user. Example (/connection/k1). Sample response below.

    [
        {
            "birthdate": "2003-09-08",
            "first_name": "Kyler",
            "frequency": "Daily",
            "gender": "M",
            "goals": [
                "lose weight",
                "build muscle"
            ],
            "height": 75,
            "last_name": "Murray",
            "level": "Beginner",
            "password": "cardinals",
            "preferred_time": "Morning",
            "username": "k90",
            "weight": 170
        },
        {
            "birthdate": "2003-09-08",
            "first_name": "Kyler",
            "frequency": "Daily",
            "gender": "M",
            "goals": [
                "lose weight",
                "build muscle"
            ],
            "height": 65,
            "last_name": "Murray",
            "level": "Beginner",
            "password": "cardinals",
            "preferred_time": "Morning",
            "username": "k4",
            "weight": 135
        }
    ]

POST /issue: submit an issue/feedback. Request body:

    {
        "username": "k1", 
        “body”: “This app sucks!”
    }

POST /calendar. Creates/updates the user's entire workout schedule. Sample request body:

    {
       "schedule": [
           {"day": "Sunday",  "end_hour": 12, "name": "cardio", "start_hour": 10.5},
           {"day": "Monday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
           {"day": "Tuesday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
          {"day": "Wednesday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
         {"day": "Thursday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
         {"day": "Friday", "end_hour": 12, "name": "cardio", "start_hour": 10.5},
        ]
        “username”: “k1”
    }

GET /calendar/username (example: /calendar/k1). Get's user weekly workout schedule. Sample response body:

    {
        "schedule": [
            {
                "day": "Sunday",
                "end_hour": 14,
                "name": "cardio",
                "start_hour": 10.5
            },
            {
                "day": "Monday",
                "end_hour": 12,
                "name": "cardio",
                "start_hour": 10.5
            }
        ],
        "username": "k1"
    }

PUT /calendar: add any number of new workouts into the weekly schedule. Duplicates are prevented. Sample request body:

    {
        "schedule": [
            {"day": "Tuesday", "start_hour": 12, "end_hour": 13, "name": "cardio"}
        ], 
        "username": "k1"
    }

POST /post: make a post. Sample request body:
    
    {
        "username": "k1", 
        “body”: “This app sucks!”
    }

GET /post/username (example /post/travis). Get all of the posts of a particualr user, sorted most to least recent. Sample response:

    [
       {
           "body": "Got an insane bicep pump today.",
           "date_time": "2023-11-14T23:59:12.679007+00:00",
           "id": 5,
           "username": "travis"
       },
       {
           "body": "Got an insane bicep pump today.",
           "date_time": "2023-11-12T23:45:28+00:00",
           "id": 4,
           "username": "travis"
       }
    ]

GET /post/feed/username (example /post/feed/k1). Get all of the posts by all connections of a particular user, sorted most to least recent. Sample response body:

    [
       {
           "body": "Got an insane quad pump today.",
           "date_time": "2023-11-15T00:08:59.441596+00:00",
           "id": 10,
           "username": "t_woods"
       },
       {
           "body": "Got an insane bicep pump today.",
           "date_time": "2023-11-15T00:08:26.279572+00:00",
           "id": 9,
           "username": "chicken"
       }
    ]

**NOTES**

Server is hosted as a free instance on Render, so spins down with inactivity. As a result, when request is made to the API when server has spun down, it takes an extra minute or so to spin up and provide that first response. This is NOT a bug or malfunction.

The values inside the _list_ provided for "exercises" in request body must be dictionaries, but the dictionaries themselves can have any key-value pairs in them (ie. could add a "weight":"50" k-v pair if desired).
