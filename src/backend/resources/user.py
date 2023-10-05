from flask.views import MethodView
from flask_smorest import Blueprint
from flask import make_response
from database import get_all_workouts, add_workout, delete_all_workouts
from schemas import WorkoutSchema

blp = Blueprint("users", __name__, description="Operations on users")



@blp.route("/user")
class User()
