import os
from supabase import create_client, Client
import datetime
import uuid

from databases.user import get_user

from databases.connection import get_connections

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def submit_post(username, body):
  if not get_user(username):
    return None
  unique_id = str(uuid.uuid4())

  new_post = {
    "username": username,
    "body": body,
    "post_id": unique_id
  }
  try:
    data = supabase.table("Posts").insert(new_post).execute()
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