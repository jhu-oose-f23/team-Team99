import os
from supabase import create_client, Client
from collections import defaultdict
from databases.user import get_user
from threading import Thread

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def get_all_workouts():
  data = supabase.table("Workouts").select("*").execute()
  return data.data

def add_workout(workout_name, exercises, user, day):
  # check if user exists
  if not get_user(user):
    return None
  
  to_update = []
  for exercise in exercises:
    to_update.append(exercise["name"].lower())
  
  # update the leaderboard cache for each of these exercises
  t = Thread(target=async_leaderboard, args=[to_update])
  t.start()
  
  workout = {
    "user": user,
    "workout_name": workout_name,
    "exercises": exercises, 
    "time": "now",
    "day": day
  }
  data = supabase.table("Workouts").insert(workout).execute()
  return data.data[0]

def delete_all_workouts():
  data = supabase.table("Workouts").delete().neq("id",0).execute()
  return data.data

def delete_workout(id):
  # remove the actual workout
  data = supabase.table("Workouts").delete().eq("id", id).execute()

  # start a worker thread to remove references to this workout from posts
  t = Thread(target=delete_workout_references, args=[id])
  t.start()

  to_update = []
  if data.data:
    exercises = data.data[0]["exercises"]
    for exercise in exercises:
      to_update.append(exercise["name"].lower())
  
  # update the leaderboard cache for each of these exercises
  t2 = Thread(target=async_leaderboard, args=[to_update])
  t2.start()
  return data.data[0] if data.data else None

def get_workout(id):
  data = supabase.table("Workouts").select("*").eq("id", id).execute()
  return data.data[0] if data.data else None

def get_user_workouts(user):
  data = supabase.table("Workouts").select("*").eq("user", user).execute()
  return data.data

def get_leaderboard(exercise):
  exercise = exercise.lower()
  # check cache
  data = supabase.table("Leaderboard_Cache").select("*").eq("exercise", exercise).execute().data
  data = data[0]["leaderboard"] if data else []
  if data:
    return data
  # if not in cache, generate the leaderboard
  leaders = generate_leaderboard(exercise)
  return leaders

def get_weight_class_leaderboard(exercise, username):
  full_leaders = get_leaderboard(exercise)
  try:
    user_weight = float(get_user(username)["weight"])
  except:
    return []
  l,h = user_weight * 0.75, user_weight * 1.25
  weight_class = set()
  for leader in full_leaders:
    weight = get_user(leader[0])["weight"]
    if weight >= l and weight <= h:
      weight_class.add(leader[0])
  return [f for f in full_leaders if f[0] in weight_class] if username in weight_class else []

def get_exercises():
  data = supabase.table("Workouts").select("*").execute().data
  exercises = set()
  for d in data:
    for e in d["exercises"]:
      exercises.add(e["name"].lower())
  return list(exercises)

'''
Helper functions
'''
def delete_workout_references(id):
  # need to remove any references to this workout from posts
  posts = supabase.table("Posts").select("*").eq("workout_id", id).execute().data
  for post in posts:
    try:
      supabase.table("Posts").update({"workout_id": None}).eq("id", post["id"]).execute()
    except:
      pass

def generate_leaderboard(exercise):
  data = supabase.table("Workouts").select("*").execute().data
  pairs = defaultdict(list)
  for d in data:
    for e in d["exercises"]:
      if e["name"].lower() == exercise.lower():
        try:
          pairs[d["user"]].append(int(e["weight"]))
        except:
          pass
  leaders = sorted([(username, max(weights)) for username, weights in pairs.items()], key=lambda x: x[1], reverse=True)
  # add to cache
  try:
    supabase.table("Leaderboard_Cache").insert({"exercise": exercise, "leaderboard": leaders}).execute()
  except:
    try:
      supabase.table("Leaderboard_Cache").update({"leaderboard": leaders}).eq("exercise", exercise).execute()
    except:
      pass
  return leaders

def async_leaderboard(exercises):
  for exercise in exercises:
    t = Thread(target=generate_leaderboard, args=[exercise])
    t.start()