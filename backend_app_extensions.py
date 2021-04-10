from flask_restx import Api
from resources.models import process_namespace, task_namespace, queue_namespace

api = Api(title="Python executor applicaton",version="0.1",doc='/docs')
api.add_namespace(process_namespace)
api.add_namespace(task_namespace)
api.add_namespace(queue_namespace)

import resources.process
import resources.queue
import resources.task