import os
from supabase import create_client, Client
from datetime import date
from heapq import *

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

def update_user(username, data):
  try:
    data = supabase.table("Users").update(data).eq("username", username).execute()
    return data.data[0]
  except:
    return None

def get_recommendations(username):
  heap = []
  heapify(heap)
  if not get_user(username):
    return []
  users = [u["username"] for u in supabase.table("Users").select("username").neq("username", username).execute().data]
  for u in users:
    if check_connection(username, u):
      continue
    try:
      sim_score = calculate_similarity(username, u)
      heappush(heap, (sim_score/6.5 * 100, u))
      if len(heap) > 5:
        heappop(heap)
    except:
      pass
  second = get_second_connections(username)
  for each in second:
    heap.append((50, each))
  res = {}
  for score,u in heap:
    res[u] = max(res.get(u,0), score)
  result = sorted([{"username": u, "percent": res[u]} for u in res], key=lambda x: (x["percent"], x["username"]), reverse=True)
  return result

'''
  Helper functions
'''
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
  height = 0.5 if abs(user1["height"] - user2["height"]) <= 5 else 0

  # handle weight
  weight = 0.5 if abs(user1["weight"] - user2["weight"]) <= 15 else 0

  # handle gender
  gen = 0.5 if user1["gender"] == user2["gender"] else 0

  # handle birthdate
  dif = abs(calculate_age(user1["birthdate"]) - calculate_age(user2["birthdate"]))
  bir = 1 if dif <= 1 else (0.5 if dif <= 2 else 0)
  
  return level + freq + pref_time + goal + height + weight + gen + bir # max-value is 6.5
 
def calculate_age(birthDate):
    today = date.today()
    age = today.year - int(birthDate[:4]) - ((today.month, today.day) < (int(birthDate[5:7]), int(birthDate[8:])))
    return age

def check_connection(user1, user2):
  if not get_user(user1) or not get_user(user2):
    return False
  data = supabase.table("Connections").select("*").eq("user1", user1).eq("user2", user2).execute().data
  if not data:
    data = supabase.table("Connections").select("*").eq("user1", user2).eq("user2", user1).execute().data
  return True if data else False

def get_second_connections(user):
  first_connections = get_connections(user)
  second_connections = set()
  for first_connection in first_connections:
    their_con = get_connections(first_connection["username"])
    second_connections.update([x["username"] for x in their_con])
  second_connections.discard(user)
  for each in first_connections:
    second_connections.discard(each["username"])
  return list(second_connections)

def get_connections(user):
  data = supabase.table("Connections").select("*").eq("user1", user).execute().data + supabase.table("Connections").select("*").eq("user2", user).execute().data
  result = set()
  for connection in data:
    result.add(connection["user1"])
    result.add(connection["user2"])
  result.discard(user)
  users = []
  for user in result:
    users.append(get_user(user))
  return users