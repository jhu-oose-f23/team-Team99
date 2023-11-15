from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response

from schemas import CalendarSchema

from databases.calendar import get_calendar, post_calendar, update_calendar, delete_calendar_workout

blp = Blueprint("calendar", __name__, description="Operations on calendars")

@blp.route("/calendar/<string:username>")
class Calendar(MethodView):
  @blp.response(200, CalendarSchema)
  def get(self, username):
    result = get_calendar(username)
    if result == None:
      abort(404, message="User does not exist")
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
@blp.route("/calendar")
class Calendar(MethodView):
  @blp.arguments(CalendarSchema)
  @blp.response(201, CalendarSchema)
  def post(self, data):
    result = post_calendar(data["username"], data["schedule"])
    if result == None:
      abort(404, message="Calendar is not valid or user does not exist")
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

  @blp.arguments(CalendarSchema)
  @blp.response(201, CalendarSchema)
  def put(self, data):
    result = update_calendar(data["username"], data["schedule"])
    if result == None:
      abort(404, message="Calendar is not valid or user does not exist")
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
  @blp.arguments(CalendarSchema)
  @blp.response(201, CalendarSchema)
  def delete(self, data):
    result = delete_calendar_workout(data["username"], data["schedule"])
    if result == None:
      abort(404, message="User does not exist")
    response = make_response(result)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response