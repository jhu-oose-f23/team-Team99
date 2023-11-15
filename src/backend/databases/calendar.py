import os
from supabase import create_client, Client

from databases.user import get_user

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def get_calendar(username):
  if not get_user(username):
    return None
  data = supabase.table("Calendars").select("*").eq("username", username).execute().data
  return data[0] if data else {"username": username, "schedule": []}

def post_calendar(username, schedule):
  if not get_user(username):
    return None
  
  # verify that the schedule is valid
  if not check_calendar(schedule):
    return None

  # remove duplicates
  new_schedule = remove_duplicates(schedule)
  
  return create_or_update_db(new_schedule, username)

def update_calendar(username, schedule):
  if not get_user(username):
    return None
  
  # verify that the schedule is valid
  if not check_calendar(schedule):
    return None
  
  # get the existing schedule
  data = get_calendar(username)["schedule"]

  # combine the new schedule with existing
  data.extend(schedule)
  
  # remove duplicates
  new_schedule = remove_duplicates(data)

  return create_or_update_db(new_schedule, username)

def delete_calendar_workout(username, schedule):
  if not get_user(username):
    return None

  # get the existing schedule
  data = get_calendar(username)["schedule"]

  # remove the workout from the schedule
  new_schedule = remove_workout(schedule, data)
  return create_or_update_db(new_schedule, username)

'''
  Helper functions
'''
def check_calendar(schedule):
  days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
  for workout in schedule:
    if type(workout["start_hour"]) not in [float, int] or type(workout["end_hour"]) not in [float, int]:
      return False
    if workout["start_hour"] < 0 or workout["start_hour"] > 24 or workout["end_hour"] < 0 or workout["end_hour"] > 24:
      return False
    if workout["start_hour"] >= workout["end_hour"]:
      return False  
    if workout["day"] not in days:
      return False
  return True

def remove_workout(to_remove, schedule):
  all_workouts = set([(s["day"], s["start_hour"], s["end_hour"], s["name"]) for s in schedule])
  serialize_removal = [(t["day"], t["start_hour"], t["end_hour"], t["name"]) for t in to_remove]
  for s in serialize_removal:
    all_workouts.discard(s)
  new_schedule = [
    {"day": s[0], "start_hour": s[1], "end_hour": s[2], "name": s[3]} for s in all_workouts
  ]
  return new_schedule

def remove_duplicates(schedule):
  removed_duplicates = set([(s["day"], s["start_hour"], s["end_hour"], s["name"]) for s in schedule])
  new_schedule = [
    {"day": s[0], "start_hour": s[1], "end_hour": s[2], "name": s[3]} for s in removed_duplicates
  ]
  return new_schedule

def create_or_update_db(new_sched, username):
  # check if the calendar already exists
  exist = supabase.table("Calendars").select("*").eq("username", username).execute().data

  # if calendar doesn't exist, create it
  if not exist:
    data = supabase.table("Calendars").insert({"username": username, "schedule": new_sched}).execute().data
  # if it does, update it
  else:
    data = supabase.table("Calendars").update({"schedule": new_sched}).eq("username", username).execute().data
  return data[0]
