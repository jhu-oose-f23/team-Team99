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