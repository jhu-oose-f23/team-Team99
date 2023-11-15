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
  if len(schedule) != 7:
    return None
  days = set()
  for day in schedule:
    days.add(day["day"])
    if type(day["start_hour"]) not in [float, int] or type(day["end_hour"]) not in [float, int]:
      return None
    if day["start_hour"] < 0 or day["start_hour"] > 24 or day["end_hour"] < 0 or day["end_hour"] > 24:
      return None
    if day["start_hour"] >= day["end_hour"]:
      return None  
  if days != {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}:
    return None
  # check if the calendar already exists
  data = supabase.table("Calendars").select("*").eq("username", username).execute().data
  # if it doesn't, create it
  if not data:
    data = supabase.table("Calendars").insert({"username": username, "schedule": schedule}).execute().data
  # if it does, update it
  else:
    data = supabase.table("Calendars").update({"schedule": schedule}).eq("username", username).execute().data
  return data[0]