from flask_restx import Namespace, Resource, fields
from flask import g
from resources.namespaces import queue_namespace as ns
from resources.models import queue_model
import models
from resources.common import standard_resource_class
from sqlalchemy.orm import Query

QueueResourceStandard = standard_resource_class(
    ns, queue_model, Query([models.Queue]))


@ns.route('/')
class QueueResource(Resource, QueueResourceStandard):
    pass
