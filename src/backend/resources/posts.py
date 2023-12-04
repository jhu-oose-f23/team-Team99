from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response
from schemas import PostSchema

from databases.posts import submit_post, get_posts, get_feed, get_image

blp = Blueprint("posts", __name__, description="Operations on posts")

@blp.route("/post")
class Post(MethodView):
    @blp.arguments(PostSchema)
    @blp.response(201, PostSchema)
    def post(self, data):
      body = data["body"]
      user = data["username"]
      data = submit_post(user, body)
      if not data:
        abort(400, message="Could not complete post. User may not exist.")
      response = make_response(data)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response
    
@blp.route("/post/<string:username>")
class Post(MethodView):
    @blp.response(200, PostSchema(many=True))
    def get(self, username):
      data = get_posts(username)
      if data == None:
        abort(400, message="Could not get posts. User may not exist.")
      response = make_response(data)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response
    
@blp.route("/post/feed/<string:username>")
class Post(MethodView):
    @blp.response(200, PostSchema(many=True))
    def get(self, username):
      data = get_feed(username)
      if data == None:
        abort(400, message="Could not get feed. User may not exist.")
      response = make_response(data)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response