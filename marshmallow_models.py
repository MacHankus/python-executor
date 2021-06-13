from marshmallow import Schema, fields

class ProcessStatsResourceSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    description = fields.Str()
    number_of_queues  = fields.Int()
    number_of_tasks = fields.Int()
    last_start_date = fields.DateTime()
    last_success_date = fields.DateTime()
    last_error_date = fields.DateTime()
    last_error = fields.Str()