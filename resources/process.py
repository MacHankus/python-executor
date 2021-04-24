from flask_restx import Namespace, Resource, fields
from sqlalchemy.orm import Query
from sqlalchemy import func
from flask import g
from resources.namespaces import process_namespace as ns
from resources.models import process_model, process_stats_model, queue_model, task_model, run_model, logs_model
import models
from resources.common import standard_resource_class, ResourceAdditional, result_to_dict
from flask_restx import reqparse
import datetime as dt

parser = reqparse.RequestParser()
parser.add_argument(
    'mode', type=str, help='Declare data that will be return. For now :stats" is valid option.')


process_stats_run_last_success_only = Query([models.ProcessRun.process_id, func.max(models.ProcessRun.end_date).label(
    'max_end_date')]).filter(models.ProcessRun.success == True).group_by(models.ProcessRun.process_id).subquery()
process_stats_run_last_error_only = Query([models.ProcessRun, func.dense_rank().over(partition_by=[models.ProcessRun.process_id], order_by=[
                                          models.ProcessRun.create_date.desc()]).label('rank')]).filter(models.ProcessRun.success == False).subquery()
process_stats_run_last_error_only_rank1 = Query(process_stats_run_last_error_only).filter(
    process_stats_run_last_error_only.c.rank == 1).subquery()
process_stats_run_last = Query([
    models.ProcessRun,
    func.dense_rank().over(
        partition_by=[models.ProcessRun.process_id],
        order_by=[models.ProcessRun.create_date.desc()]
    ).label('rank')]).subquery()
process_stats_run_last_filtered = Query([
    process_stats_run_last.c.process_id,
    process_stats_run_last.c.start_date.label('last_start_date'),
    process_stats_run_last.c.end_date.label('last_end_date'),
    process_stats_run_last_success_only.c.max_end_date.label(
        'last_success_date'),
    process_stats_run_last_error_only_rank1.c.end_date.label(
        'last_error_date'),
    process_stats_run_last_error_only_rank1.c.error_msg.label('last_error')
]) \
    .filter(process_stats_run_last.c.rank == 1) \
    .outerjoin(process_stats_run_last_success_only, process_stats_run_last_success_only.c.process_id == process_stats_run_last.c.process_id) \
    .outerjoin(process_stats_run_last_error_only_rank1, process_stats_run_last_error_only_rank1.c.process_id == process_stats_run_last.c.process_id).subquery()
process_stats_num_tasks = Query([models.Process.id.label('process_id'), func.count(models.QueueTask.task_id).label('number_of_tasks')]).outerjoin(
    models.Queue, models.Queue.process_id == models.Process.id).outerjoin(models.QueueTask, models.QueueTask.queue_id == models.Queue.id).group_by(models.Process.id).subquery()
process_stats_num_queues = Query([models.Queue.process_id, func.count().label(
    'number_of_queues')]).group_by(models.Queue.process_id).subquery()
process_stats_query = Query([
    models.Process.id,
    models.Process.name,
    models.Process.description
]).subquery()
process_stats_final_query = Query([
    process_stats_query.c.id.label('id'),
    process_stats_query.c.name.label('name'),
    process_stats_query.c.description.label('description'),
    process_stats_num_queues.c.number_of_queues.label('number_of_queues'),
    process_stats_num_tasks.c.number_of_tasks.label('number_of_tasks'),
    process_stats_run_last_filtered.c.last_start_date.label('last_start_date'),
    process_stats_run_last_filtered.c.last_success_date.label(
        'last_success_date'),
    process_stats_run_last_filtered.c.last_error_date.label('last_error_date'),
    process_stats_run_last_filtered.c.last_error.label('last_error')
]) \
    .outerjoin(process_stats_num_queues, process_stats_query.c.id == process_stats_num_queues.c.process_id) \
    .outerjoin(process_stats_num_tasks, process_stats_query.c.id == process_stats_num_tasks.c.process_id) \
    .outerjoin(process_stats_run_last_filtered, process_stats_run_last_filtered.c.process_id == process_stats_query.c.id)
ProcessStatsResourceStandard = standard_resource_class(
    ns, process_stats_model, process_stats_final_query)


@ns.route('/stats')
class ProcessStatsResource(ResourceAdditional):
    @ns.marshal_with(process_stats_model, as_list=True,envelope="process_stats")
    def get(self):
        columns_names = [ x['name'] for x in process_stats_final_query.column_descriptions]
        stats = process_stats_final_query.with_session(g.session).all()
        return result_to_dict(columns_names,stats), 200

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
