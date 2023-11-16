import os
from supabase import create_client, Client
import datetime

from databases.user import get_user

from databases.connection import get_connections

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def submit_post(username, body):
  if not get_user(username):
    return None
  new_issue = {
    "username": username,
    "body": body,
  }
  data = supabase.table("Posts").insert(new_issue).execute()
  return data.data[0]

def get_posts(username):
  if not get_user(username):
    return None
  data = supabase.table("Posts").select("*").eq("username", username).execute().data
  data.sort(key=lambda x:x["date_time"], reverse=True)
  return data

def get_feed(username):
  if not get_user(username):
    return None
  connections = get_connections(username)
  data = []
  for connection in connections:
    data += get_posts(connection["username"])
  data.sort(key=lambda x:x["date_time"], reverse=True)
  return data
