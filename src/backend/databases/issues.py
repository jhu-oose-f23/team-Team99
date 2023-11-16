import os
from supabase import create_client, Client

from databases.user import get_user

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def submit_issue(username, body):
  if not get_user(username):
    return None
  new_issue = {
    "username": username,
    "body": body
  }
  data = supabase.table("Issues").insert(new_issue).execute()
  return data.data[0]