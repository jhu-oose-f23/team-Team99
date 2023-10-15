import os
from supabase import create_client, Client
from databases.user import get_user

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def check_connection(user1, user2):
  if not get_user(user1) or not get_user(user2):
    return "One or both of the users doesn't exist"
  data = supabase.table("Connections").select("*").eq("user1", user1).eq("user2", user2).execute().data
  if not data:
    data = supabase.table("Connections").select("*").eq("user1", user2).eq("user2", user1).execute().data
  return True if data else False

def get_connections(user):
  data = supabase.table("Connections").select("*").eq("user1", user).execute().data + supabase.table("Connections").select("*").eq("user2", user).execute().data
  result = set()
  for connection in data:
    result.add(connection["user1"])
    result.add(connection["user2"])
  result.remove(user)
  return list(result)

def delete_connection(user1, user2):
  data = supabase.table("Connections").delete().eq("user1", user1).eq("user2", user2).execute()
  if not data.data:
    data = supabase.table("Connections").delete().eq("user1", user2).eq("user2", user1).execute()
  return data.data[0]