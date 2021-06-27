import resources.task
import resources.queue
import resources.process
from flask_restx import Api
from resources.namespaces import process_namespace, task_namespace, queue_namespace
from resources import models

api = Api(title="Python executor applicaton", version="0.1", doc='/docs')

api.add_namespace(process_namespace)
api.add_namespace(task_namespace)
api.add_namespace(queue_namespace)

models = [
    models.process_model,
    models.process_stats_model,
    models.queue_model,
    models.task_model,
    models.logs_model,
    models.run_model
]

for model in models:
    api.models[model.name] = model
