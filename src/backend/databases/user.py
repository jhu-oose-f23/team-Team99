import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def add_user(data):
  try:
    data = supabase.table("Users").insert(data).execute()
    return data.data[0]
  except:
    return None

def get_all_users():
  data = supabase.table("Users").select("first_name, last_name, username").execute()
  return data.data

def get_user(username):
  data = supabase.table("Users").select("*").eq("username", username).execute().data
  return data[0] if data else None

def login_user(username, password):
  data = supabase.table("Users").select("first_name, last_name, username").eq("username", username).eq("password", password).execute().data
  return data[0] if data else None

def get_recommendations(username):
  users = [u["username"] for u in supabase.table("Users").select("username").neq("username", username).execute().data]
  result = []
  for u in users:
    sim_score = calculate_similarity(username, u)
    if sim_score > 0:
      result.append((u, sim_score))
  return result

def jaccard_similarity(x, y):
    intersection = len(set(x).intersection(y))
    union = len(set(x).union(y))
    return intersection / union

def calculate_similarity(username1, username2):
  user1 = supabase.table("Users").select("*").eq("username", username1).execute().data[0]
  user2 = supabase.table("Users").select("*").eq("username", username2).execute().data[0]
  
  # handle level
  levels = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3
  }
  l1, l2 = levels[user1["level"]], levels[user2["level"]]
  level = 1 if l1 == l2 else (0.5 if abs(l1 - l2) == 1 else 0)

  # handle frequency
  freq = 1 if user1["frequency"] == user2["frequency"] else 0

  # handle preferred_time
  pref_time = 1 if user1["preferred_time"] == user2["preferred_time"] else 0

  # handle goals
  goal = jaccard_similarity(user1["goals"], user2["goals"])

  # handle height

  # handle weight

  # handle gender
  gen = 0.5 if user1["gender"] == user2["gender"] else 0

  # handle birthdate

  return 0