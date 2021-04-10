from flask_restx import fields, Namespace

process_namespace = Namespace("process","Get project related data.",path="/api/process")
queue_namespace = Namespace("queue","Get queue related data.",path="/api/queue")
task_namespace = Namespace("task","Get task related data.",path="/api/task")

base = {
    'id': fields.Integer,
    'create_date': fields.DateTime,
    'mod_date': fields.DateTime
}
base_process = {
    'name' : fields.String,
    'description' : fields.String
}
base_queue = {
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
process_model = process_namespace.model('Process', {**base,**base_process})
queue_model = process_namespace.model('Queue', {**base,**base_queue})
task_model = process_namespace.model('Task', {**base,**task_queue})

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