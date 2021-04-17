from flask_restx import fields
from flask_restx import Model
from resources.namespaces import *

base = {
    'id': fields.Integer,
    'create_date': fields.DateTime,
    'mod_date': fields.DateTime
}
process = {
    'name' : fields.String,
    'description' : fields.String
}
queue = {
    'process_id' : fields.Integer,
    'name' : fields.String,
    'run_order' : fields.Integer,
    'blocking' : fields.Boolean
}
task_queue = {
    'file_path' : fields.String,
    'code' : fields.String,
    'function' : fields.String,
    'arguments' : fields.String,
    'task_type_id' : fields.Integer
}
run = {
    'process_id' : fields.Integer,
    'start_date' : fields.DateTime,
    'end_date': fields.DateTime,
    'last_activity_date' : fields.DateTime,
    'error_msg' : fields.String,
    'success': fields.Boolean
}
logs = {
    'subject'  : fields.String,
    'id_subject' : fields.Integer,
    'start_date' : fields.DateTime,
    'end_date' : fields.DateTime,
    'working' : fields.Boolean,
    'success' : fields.Boolean,
    'error_msg'  : fields.String,
}
process_model = Model('Process', {**base,**process})
queue_model = Model('Queue', {**base,**queue})
task_model = Model('Task', {**base,**task_queue})
run_model = Model('Run',{**base,**run})
logs_model = Model('Logs',{**base,**logs})

process_stats_model = process_namespace.model('ProcessStats',{
    'id':fields.Integer,
    'name':fields.String,
    'description':fields.String,
    'last_start_date':fields.DateTime,
    'last_end_date':fields.DateTime,
    'last_success_date':fields.DateTime,
    'last_error_date':fields.DateTime,
    'last_error':fields.String,
    'number_of_queues':fields.Integer,
    'number_of_tasks':fields.Integer
})