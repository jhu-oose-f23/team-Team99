from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response
from databases.workouts import get_all_workouts, add_workout, delete_all_workouts, get_user_workouts, delete_workout, get_leaderboard, get_exercises, get_weight_class_leaderboard
from schemas import WorkoutSchema

blp = Blueprint("workouts", __name__, description="Operations on workouts")

@blp.route("/workouts")
class Workout(MethodView):
    @blp.response(200, WorkoutSchema(many=True))
    def get(self):
      data = get_all_workouts()
      response = make_response(data)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response

    @blp.arguments(WorkoutSchema)
    @blp.response(201, WorkoutSchema)
    def post(self, new_data):
      work_name = new_data["workout_name"]
      exercises = new_data["exercises"]
      user = new_data["user"]
      data = add_workout(work_name, exercises, user)
      response = make_response(data)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response
    
    @blp.response(200, WorkoutSchema(many=True))
    def delete(self):
      data = delete_all_workouts()
      response = make_response(data)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response
    
@blp.route("/workouts/<string:user>")
class Workout(MethodView):
  @blp.response(200, WorkoutSchema(many=True))
  def get(self, user):
    data = get_user_workouts(user)
    response = make_response(data)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
@blp.route("/workouts/<int:id>")
class Workout(MethodView):
  @blp.response(200, WorkoutSchema)
  def delete(self, id):
    data = delete_workout(id)
    if not data:
      abort(400, message="Workout not found")
    response = make_response(data)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
@blp.route("/workouts/leaderboard/<string:exercise>")
class Workout(MethodView):
  @blp.response(200)
  def get(self, exercise):
    data = get_leaderboard(exercise)
    response = make_response(data)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
@blp.route("/workouts/leaderboard/<string:exercise>/<string:username>")
class Workout(MethodView):
  @blp.response(200)
  def get(self, exercise, username):
    data = get_weight_class_leaderboard(exercise, username)
    response = make_response(data)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
  
@blp.route("/workouts/leaderboard")
class Workout(MethodView):
  @blp.response(200)
  def get(self):
    data = get_exercises()
    response = make_response(data)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response