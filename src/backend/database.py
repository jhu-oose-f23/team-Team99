import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def get_all_workouts():
  data = supabase.table("Workouts").select("*").execute()
  return data.data

def add_workout(workout_name, exercises):
  workout = {
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

def add_user(data):
  try:
    data = supabase.table("Users").insert(data).execute()
    return data.data[0]
  except:
    return None

def get_all_users():
  data = supabase.table("Users").select("first_name, last_name, username, id").execute()
  return data.data

def get_user(username):
  data = supabase.table("Users").select("*").eq("username", username).execute().data
  return data[0] if data else None

def login_user(username, password):
  data = supabase.table("Users").select("first_name, last_name, username, id").eq("username", username).eq("password", password).execute().data
  return data[0] if data else None

def connect(user1, user2):
  connection = {
    "user1": user1,
    "user2": user2,
  }
  if user1 == user2:
    return "Cannot connect to yourself"
  if get_user(user1) is None or get_user(user2) is None:
    return "One or both of the users doesn't exist"
  if check_connection(user1, user2):
    return "Already connected"
  data = supabase.table("Connections").insert(connection).execute()
  return data.data[0]

def check_connection(user1, user2):
  if not get_user(user1) or not get_user(user2):
    return "One or both of the users doesn't exist"
  data = supabase.table("Connections").select("*").eq("user1", user1).eq("user2", user2).execute().data
  if not data:
    data = supabase.table("Connections").select("*").eq("user1", user2).eq("user2", user1).execute().data
  return True if data else False