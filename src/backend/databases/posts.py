import os
from supabase import create_client, Client
import datetime
import uuid

from databases.user import get_user

from databases.connection import get_connections

from databases.workouts import get_user_workouts

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def submit_post(data):
  if not get_user(data["username"]):
    return None
  
  # need to make sure that if a workout id was provided, it actually exists and belongs to this user
  user_workouts = get_user_workouts(data["username"])
  found = False
  workout_id = data["workout_id"] if "workout_id" in data else None
  for workout in user_workouts:
    if workout["id"] == workout_id:
      found = True
      break
  if not found and workout_id:
    return "Workout not found for this user"

  # update db
  try:
    data = supabase.table("Posts").insert(data).execute()
  except:
    return None
  return data.data[0]

def get_posts(username):
  data = get_user_posts(username)
  data.sort(key=lambda x:x["date_time"], reverse=True)
  return data

def get_feed(username):
  if not get_user(username):
    return None
  connections = get_connections(username)
  data = []
  for connection in connections:
    data += get_user_posts(connection["username"])
  data.sort(key=lambda x:x["date_time"], reverse=True)
  return data

'''
Helper functions
'''
def get_user_posts(username):
  if not get_user(username):
    return None
  data = supabase.table("Posts").select("*").eq("username", username).execute().data
  return data