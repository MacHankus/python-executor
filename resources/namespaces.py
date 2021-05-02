from flask_restx import  Namespace

process_namespace = Namespace("process","Get project related data.",path="/api/processes")
queue_namespace = Namespace("queue","Get queue related data.",path="/api/queues")
task_namespace = Namespace("task","Get task related data.",path="/api/tasks")
