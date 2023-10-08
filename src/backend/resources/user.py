from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response
from database import add_user, get_users
from schemas import UserSchema

blp = Blueprint("users", __name__, description="Operations on users")

@blp.route("/user")
class User(MethodView):
  @blp.arguments(UserSchema)
  @blp.response(201, UserSchema)
  def post(self, new_data):
    result = add_user(new_data)
    if result == "Username already exists":
      abort(400)
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
  @blp.response(200, UserSchema(many=True))
  def get(self):
    result = get_users()
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response