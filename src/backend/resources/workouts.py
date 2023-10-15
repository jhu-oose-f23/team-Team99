from flask.views import MethodView
from flask_smorest import Blueprint
from flask import make_response
from databases.workouts import get_all_workouts, add_workout, delete_all_workouts, get_user_workouts
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