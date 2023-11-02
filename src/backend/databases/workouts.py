import os
from supabase import create_client, Client
from collections import defaultdict

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def get_all_workouts():
  data = supabase.table("Workouts").select("*").execute()
  return data.data

def add_workout(workout_name, exercises, user):
  workout = {
    "user": user,
    "workout_name": workout_name,
    "exercises": exercises, 
    "time": "now", 
    "day": "today"
  }
  data = supabase.table("Workouts").insert(workout).execute()
  return data.data[0]

def delete_all_workouts():
  data = supabase.table("Workouts").delete().neq("id",0).execute()
  return data.data

def delete_workout(id):
  data = supabase.table("Workouts").delete().eq("id", id).execute()
  return data.data[0] if data.data else None

def get_user_workouts(user):
  data = supabase.table("Workouts").select("*").eq("user", user).execute()
  return data.data

def get_leaderboard(exercise):
  data = supabase.table("Workouts").select("*").execute().data
  pairs = defaultdict(list)
  for d in data:
    for e in d["exercises"]:
      if e["name"].lower() == exercise.lower():
        pairs[d["user"]].append(e["weight"])
  leaders = [(username, max(weights)) for username, weights in pairs.items()]
  return sorted(leaders, key=lambda x: x[1], reverse=True)

def get_exercises():
  data = supabase.table("Workouts").select("*").execute().data
  exercises = set()
  for d in data:
    for e in d["exercises"]:
      exercises.add(e["name"].lower())
  return list(exercises)
