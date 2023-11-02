from flask import Flask
from flask_cors import CORS
from flask_smorest import Api
from resources.workouts import blp as WorkoutsBlueprint
from resources.user import blp as UserBlueprint
from resources.connection import blp as ConnectionBlueprint
from resources.conn_request import blp as ConnectionRequestBlueprint

app = Flask(__name__)

CORS(app)

app.config["PROPAGATE_EXCEPTIONS"] = True
app.config["API_TITLE"] = "GymConnect API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.3"
app.config["OPENAPI_URL_PREFIX"] = "/"
app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

api = Api(app)
api.register_blueprint(WorkoutsBlueprint)
api.register_blueprint(UserBlueprint)
api.register_blueprint(ConnectionBlueprint)
api.register_blueprint(ConnectionRequestBlueprint)