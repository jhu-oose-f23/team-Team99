from supabase import create_client, Client

url = "https://btnctdrhtfujuxuuqkke.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bmN0ZHJodGZ1anV4dXVxa2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMDI0NTQsImV4cCI6MjAxMTY3ODQ1NH0.uwp4_fStNK0ieh0LCtJ-5E7ZQzPOUBQ0aS3DWL3E68o"

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