import os
from supabase import create_client, Client
from databases.user import get_user
from databases.connection import check_connection
from databases.user import get_recommendations
from threading import Thread

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def create_request(source, dest):
  if source == dest:
    return "Cannot connect to yourself"
  if not get_user(source) or not get_user(dest):
    return "One or both of the users doesn't exist"
  if check_connection(source, dest):
    return "Already connected"
  req = {
    "source": source,
    "dest": dest
  }
  if not check_requests(source, dest):
    return supabase.table("Connection_Requests").insert(req).execute().data[0]
  else:
    return "Request already exists"

def check_requests(source,dest):
  if not get_user(source) or not get_user(dest):
    return "One or both of the users doesn't exist"
  data = supabase.table("Connection_Requests").select('*').eq("source", source).eq("dest", dest).execute()
  if not data.data:
    data = supabase.table("Connection_Requests").select('*').eq("source", dest).eq("dest", source).execute()
  return True if data.data else False

def delete_request(source, dest):
  data = supabase.table("Connection_Requests").delete().eq("source", source).eq("dest", dest).execute()
  return data.data[0] if data.data else "Request does not exist"

def get_inc_requests(dest):
  data = supabase.table("Connection_Requests").select("*").eq("dest", dest).execute().data
  return [data["source"] for data in data]

def get_out_requests(source):
  data = supabase.table("Connection_Requests").select("*").eq("source", source).execute().data
  return [data["dest"] for data in data]

def accept_connection(source, dest):
  if not check_requests(source, dest):
    return "Request does not exist"
  if not supabase.table("Connection_Requests").delete().eq("source", source).eq("dest", dest).execute().data:
    return "Request does not exist"
  new_conn = {
    "user1": source,
    "user2": dest
  }
  try:
    supabase.table("Connections").insert(new_conn).execute().data[0]
  except:
    return "Connection already exists"
  
  # clear recommendation cache for both users
  supabase.table("Recommendation_Cache").delete().eq("user_id", source).execute()
  supabase.table("Recommendation_Cache").delete().eq("user_id", dest).execute()

  # recalculate recommendations for both users
  t1 = Thread(target=get_recommendations, args=(source,))
  t1.start()
  t2 = Thread(target=get_recommendations, args=(dest,))
  t2.start()
  
  return supabase.table("Connections").select("*").eq("user1", source).eq("user2", dest).execute().data[0]