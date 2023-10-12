from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response
from database import connect, check_connection
from schemas import ConnectionSchema

blp = Blueprint("connections", __name__, description="Operations on connections")

@blp.route("/connection")
class User(MethodView):
  @blp.arguments(ConnectionSchema)
  @blp.response(201, ConnectionSchema)
  def post(self, connection):
    result = connect(connection["user1"], connection["user2"])
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
  @blp.arguments(ConnectionSchema)
  def get(self, connection):
    result = check_connection(connection["user1"], connection["user2"])
    response = make_response(str(result))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response