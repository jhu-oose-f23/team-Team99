from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response
from databases.connection import connect, check_connection, get_connections, delete_connection
from schemas import ConnectionSchema

blp = Blueprint("connections", __name__, description="Operations on connections")

@blp.route("/connection")
class Connection(MethodView):
  # @blp.arguments(ConnectionSchema)
  # @blp.response(201, ConnectionSchema)
  # def post(self, connection):
  #   result = connect(connection["user1"], connection["user2"])
  #   response = make_response(result)
  #   response.headers['Access-Control-Allow-Origin'] = '*'
  #   return response
  
  @blp.arguments(ConnectionSchema)
  def get(self, connection):
    result = check_connection(connection["user1"], connection["user2"])
    response = make_response(str(result))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
  @blp.arguments(ConnectionSchema)
  @blp.response(200, ConnectionSchema)
  def delete(self, connection):
    result = check_connection(connection["user1"], connection["user2"])
    if result == True:
      result = delete_connection(connection["user1"], connection["user2"])
      response = make_response(result)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response
    else:
      abort(404, message="Connection doesn't exist")
  
@blp.route("/connection/<string:user>")
class Connection(MethodView):
  def get(self, user):
    result = get_connections(user)
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response