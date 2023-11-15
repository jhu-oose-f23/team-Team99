from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response
from databases.user import add_user, get_all_users, get_user, login_user, get_recommendations, update_user
from schemas import UserSchema, LoginSchema, UsernameSchema

blp = Blueprint("users", __name__, description="Operations on users")

@blp.route("/user")
class User(MethodView):
  @blp.arguments(UserSchema)
  @blp.response(201, UserSchema)
  def post(self, new_data):
    result = add_user(new_data)
    if not result:
      abort(400, message = "Username already exists")
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
  @blp.response(200, UserSchema(many=True))
  def get(self):
    result = get_all_users()
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
  @blp.arguments(UserSchema)
  @blp.response(200, UserSchema)
  def put(self, data):
    result = update_user(data["username"], data)
    if not result:
      abort(400, message="User not found")
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
@blp.route("/user/<string:username>")
class User(MethodView):
  @blp.response(200, UserSchema)
  def get(self, username):
    result = get_user(username)
    if result:
      response = make_response(result)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response
    abort(400, message="User not found")

@blp.route("/user/login")
class User(MethodView):
  @blp.arguments(LoginSchema)
  @blp.response(200, UserSchema)
  def post(self, data):
    result = login_user(data["username"], data["password"])
    if not result:
      abort(400, message="Invalid username or password")
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
@blp.route("/user/recommendations/<string:username>")
class User(MethodView):
  @blp.response(200, UsernameSchema(many=True))
  def get(self, username):
    result = get_recommendations(username)
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  

