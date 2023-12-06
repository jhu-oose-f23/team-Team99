import os
from supabase import create_client, Client
from datetime import date
from heapq import *
import threading

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
  # first hit the cache to check whether recommendations have been stored recently
  data = supabase.table("Recommendation_Cache").select("*").eq("user_id", username).execute().data
  data = data[0] if data else []
  last_updated = data["last_updated"] if data else None

  # if there are no recommendations, or those recommendations are more than 7 days old, regenerate them
  if not data or check_days(last_updated) > 7:
    return generate_recommendations(username)
  return data["recs"]

'''
  Helper functions
'''
def generate_recommendations(username):
    recs = []
    # add second degree connections with a default similarity of 40%
    second = get_second_connections(username)
    for each in second[:5]:
      recs.append((40, each))
    # make a dict to pass into the background thread for further recommendation generation
    further_generation = {u: s for s,u in recs}
    # start a thread to use workout and profile data to find similar users WITHOUT blocking response
    t = threading.Thread(target=background_recommendations, args=[username, further_generation])
    t.start()
    return recs # return the list of only second degree connections

def background_recommendations(username, existing_map):
  existing_map = compare_workouts(username, existing_map)
  existing_map = compare_profiles(username, existing_map)

  result = sorted([{"username": u, "percent": existing_map[u]} for u in existing_map], key=lambda x: (x["percent"], x["username"]), reverse=True)
  today = date.today()
  # build a recommendation dictionary to store in the cache
  data = {"user_id": username, "recs": result, "last_updated": f"{today.month}-{today.day}-{today.year}"}
  # add to cache or update that user's recs if already exists
  try:
    data = supabase.table("Recommendation_Cache").insert(data).execute()
  except:
    try:
      data = supabase.table("Recommendation_Cache").update(data).eq("user_id", username).execute()
    except:
      pass
  return result

def compare_profiles(user, existing_map):
  # use a heap to store only the 5 most similar users
  heap = []
  heapify(heap)
  if not get_user(user):
    return existing_map
  users = [u["username"] for u in supabase.table("Users").select("username").neq("username", user).execute().data]
  # check all users (besides the current user)
  for u in users:
    # ignore those already connected
    if check_connection(user, u):
      continue
    try:
      sim_score = calculate_similarity(user, u)
      heappush(heap, (sim_score/6.5 * 100, u))
      # maintain only up to 5 users
      if len(heap) > 5:
        heappop(heap)
    except:
      pass
  
  # add the 5 most similar users to the existing map
  for score, u in heap:
    existing_map[u] = max(score, existing_map.get(u, 0))
  return existing_map

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
  goal = jaccard_similarity([g.lower() for g in user1["goals"]], [g.lower() for g in user2["goals"]])

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

def check_days(prev_date):
  today = date.today()
  prev_date = prev_date.split("-")
  prev_date = date(int(prev_date[0]), int(prev_date[1]), int(prev_date[2]))
  return (today - prev_date).days

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

def get_user_workouts(user):
  data = supabase.table("Workouts").select("*").eq("user", user).execute()
  return data.data

def compare_workouts(user, existing_map):
  ## approach is to make vectors for each user's exercise history, then calculate similarity using cosine similarity
  all_users = get_all_users()
  possible_users = set()
  for each in all_users:
    if each["username"] == user or check_connection(user, each["username"]):
      continue
    possible_users.add(each["username"])
  
  # first calculate a vector for this user's exercise history (the proportion of a particular exercise compared to all exercises)
  this_user_workouts = get_user_workouts(user)
  this_user_exercises = {}
  for w in this_user_workouts:
    for e in w["exercises"]:
      this_user_exercises[e["name"]] = this_user_exercises.get(e["name"], 0) + 1
  this_user_percentages = {}
  total_appearances = sum(this_user_exercises.values())
  for e in this_user_exercises:
    this_user_percentages[e] = this_user_exercises[e] / total_appearances
  
  # go through each other potential user, doing the same (calculate the vector)
  for each in possible_users:
    exercises = {}
    user_workouts = get_user_workouts(each)
    for w in user_workouts:
      for e in w["exercises"]:
        exercises[e["name"]] = exercises.get(e["name"], 0) + 1
    percentages = {}
    total_appearances = sum(exercises.values())
    for e in exercises:
      percentages[e] = exercises[e] / total_appearances

    # calculate similarity using cosine similarity on the two exercise vectors
    sim = cosine_similarity(this_user_percentages, percentages)

    # if they meet the threshold, update the existing dict of similar users
    if sim >= 0.5:
      existing_map[each] = max(60, existing_map.get(each, 0))
  return existing_map
  
def cosine_similarity(dict1, dict2):
  dot_product = sum(dict1.get(exercise, 0) * dict2.get(exercise, 0) for exercise in set(dict1) & set(dict2))

  magnitude_dict1 = (sum(value**2 for value in dict1.values())) ** (1/2)
  magnitude_dict2 = (sum(value**2 for value in dict2.values())) ** (1/2)

  if magnitude_dict1 == 0 or magnitude_dict2 == 0:
      return 0  # To avoid division by zero

  similarity = dot_product / (magnitude_dict1 * magnitude_dict2)
  return similarity