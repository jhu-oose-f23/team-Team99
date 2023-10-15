from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response
from databases.conn_request import create_request, delete_request, get_requests, accept_connection
from schemas import ConnectionRequestSchema, ConnectionSchema

blp = Blueprint("connection requests", __name__, description="Operations on connection requests")

@blp.route("/connection/request")
class ConnectionRequest(MethodView):
  @blp.arguments(ConnectionRequestSchema)
  @blp.response(201, ConnectionRequestSchema)
  def post(self, connection):
    result = create_request(connection["source"], connection["dest"])
    if type(result) == str:
      abort(404, message=result)
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
  @blp.arguments(ConnectionRequestSchema)
  @blp.response(200, ConnectionRequestSchema)
  def delete(self, connection):
    result = delete_request(connection["source"], connection["dest"])
    if type(result) == str:
      abort(404, message=result)
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
  @blp.arguments(ConnectionRequestSchema)
  @blp.response(200, ConnectionSchema)
  def put(self, connection):
    result = accept_connection(connection["source"], connection["dest"])
    if type(result) == str:
      abort(404, message=result)
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
@blp.route("/connection/request/<string:dest>")
class ConnectionRequest(MethodView):
  @blp.response(200, ConnectionRequestSchema)
  def get(self, dest):
    result = get_requests(dest)
    if type(result) == str:
      abort(404, message=result)
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response