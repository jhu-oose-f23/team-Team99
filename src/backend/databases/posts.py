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

  new_issue = {
    "username": username,
    "body": body,
    "post_id": unique_id
  }
  try:
    data = supabase.table("Posts").insert(new_issue).execute()
  except:
    return None
  
  # use unique_id to add image to the storage bucket

  return data.data[0]

def get_posts(username):
  data = get_user_posts(username)
  data.sort(key=lambda x:x["date_time"], reverse=True)
  print(data)
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
def get_image(post_id):
  try:
    # res = supabase.storage.from_('post_images').create_signed_url(f"{post_id}.jpg", 1200)
    res = supabase.storage.from_('testing').create_signed_url("75d1eebd-72ef-4bbc-89dc-6d8fe01c08cf.jpg", 1200)
  except:
    return None
  return res

def get_user_posts(username):
  if not get_user(username):
    return None
  data = supabase.table("Posts").select("*").eq("username", username).execute().data
  for each in data:
    # each["image_url"] = f"https://btnctdrhtfujuxuuqkke.supabase.co/storage/v1/object/public/post_images/{each['post_id']}.jpg"
    # each["image_url"] = get_image(each["post_id"])["signedURL"]
    each["image_url"] = get_image("HEHE")["signedURL"]
    # print(each)
    # try:
    #   each["image_url"] = get_image(each["post_id"])["signedURL"]
    # except:
    #   each["image_url"] = None


  return data