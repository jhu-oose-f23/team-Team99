from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import make_response
from schemas import IssueSchema

from databases.issues import submit_issue

blp = Blueprint("issues", __name__, description="Operations on issues")

@blp.route("/issue")
class Issue(MethodView):
    @blp.arguments(IssueSchema)
    @blp.response(201, IssueSchema)
    def post(self, data):
      body = data["body"]
      user = data["username"]
      data = submit_issue(user, body)
      if not data:
        abort(400, message="Could not submit issue. User may not exist.")
      response = make_response(data)
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response