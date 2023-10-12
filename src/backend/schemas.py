from marshmallow import Schema, fields

class WorkoutSchema(Schema):
    id = fields.Int(dump_only=True)
    workout_name = fields.Str(required=True)
    exercises = fields.List(fields.Dict(), required=True)
    time = fields.Str(dump_only=True)
    day = fields.Str(dump_only=True)

class UserSchema(Schema):
    id = fields.UUID(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    gender = fields.Str(required=True)
    birthdate = fields.Str(required=True)
    weight = fields.Int(required=True)
    height = fields.Int(required=True)
    goals = fields.List(fields.Str(), required=True)
    level = fields.Str(required=True)
    frequency = fields.Str(required=True)
    preferred_time = fields.Str(required=True)

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

class ConnectionSchema(Schema):
    user1 = fields.Str(required=True)
    user2 = fields.Str(required=True)
    connected_on = fields.Str(dump_only=True)