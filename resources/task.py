from flask_restx import Namespace, Resource, fields
from flask import g
from resources.models import task_model
import models
from resources.namespaces import task_namespace as ns
from resources.common import standard_resource_class, ResourceAdditional
from sqlalchemy.orm import Query

TaskResourceStandard = standard_resource_class(
    ns, task_model, Query([models.Task]))


@ns.route('/')
class TaskResource(ResourceAdditional, TaskResourceStandard):
    pass
