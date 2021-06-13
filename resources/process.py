from flask_restx import Namespace, Resource, fields
from sqlalchemy.orm import Query
from sqlalchemy import func
from flask import g
from validator_collection import validators
from resources.namespaces import process_namespace as ns
from resources.models import process_model, process_stats_model, queue_model, task_model, run_model, logs_model
import models
from resources.common import standard_resource_class, ResourceAdditional
from flask_restx import reqparse
import datetime as dt
import marshmallow_models as mm
import resources.query as query
import resources.pagination as pagination


parser = reqparse.RequestParser()
parser.add_argument(
    'mode', type=str, help='Declare data that will be return. For now "stats" is valid option.')


@ns.route('/stats')
class ProcessStatsResource(ResourceAdditional):
    @ns.marshal_with(process_stats_model, as_list=True,envelope="process_stats")
    @pagination.Pagination(
        query.process_stats_final_query,
        'id',
        pagination.ColumnDescription() \
            .add('id', query.process_stats_final_query.column_descriptions[0]['expr'], validators.integer)
    )
    def get(self, paginated_query=None):
        # get stats from db
        stats = paginated_query.with_session(g.session).all()
        # dump objects into dicts
        mmodel = mm.ProcessStatsResourceSchema()
        dump = mmodel.dump(stats, many=True)
        return dump, 200

@ns.route('/<int:process_id>/tasks')
class ProcessTaskResource(ResourceAdditional):
    @ns.marshal_with(task_model, as_list=True, envelope="tasks")
    def get(self, process_id):
        tasks = g.session.query(models.Task).join(models.QueueTask).join(
            models.Queue).filter(models.Queue.process_id == process_id).all()
        return tasks, 200


@ns.route('/<int:process_id>/queues')
class ProcessQueueResource(ResourceAdditional):
    @ns.marshal_with(queue_model, as_list=True, envelope="queues")
    def get(self, process_id):
        queues = g.session.query(models.Queue).filter(
            models.Queue.process_id == process_id).all()
        return queues, 200


@ns.route('/<int:process_id>/runs')
class ProcessRunResource(ResourceAdditional):
    @ns.marshal_with(run_model, as_list=True, envelope="runs")
    def get(self, process_id):
        runs = g.session.query(models.ProcessRun).filter(
            models.ProcessRun.process_id == process_id).all()
        return runs, 200


@ns.route('/<int:process_id>/errors')
class ProcessErrorResource(ResourceAdditional):
    @ns.marshal_with(logs_model, as_list=True, envelope="errors")
    def get(self, process_id):
        errors = g.session.query(models.Log).filter(
            models.Log.process_id == process_id, models.Log.success == False).all()
        return errors, 200
