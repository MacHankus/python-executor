import connection
import models

def db_create_table(session):
    models.Base.metadata.drop_all(connection.engine)
    models.Base.metadata.create_all(connection.engine)
def db_fill_tables(session):
    task_types = [
        models.TaskTypeDict(
            id = 1,
            name = "sql_file",
            description = "File contains only SQL instructions"
        ),
        models.TaskTypeDict(
            id = 2,
            name = "plsql_file",
            description = "File contains PL/SQL instructions"
        ),
        models.TaskTypeDict(
            id = 3,
            name = "python_code_file",
            description = "File with python code. file_name contains file with python code."
        ),
        models.TaskTypeDict(
            id = 4,
            name = "python_function",
            description = "Python function to execute. This function should be in special module available for main executor to import. arguments field may contain additional arguments to insert into function."
        )
    ]
    session.bulk_save_objects(task_types)
    session.commit()
    process_1 = models.Process(
        name = 'TESTPROCESS_1',
        description = 'Test process with test tasks and queues.',
        logfolder = "./executor_logs/TEST_PROCESS_1"
    )
    queue_1 = process_1.create_queue()
    queue_1.name = "TEST_QUEUE_1"
    queue_1.run_order = 1
    queue_1.blocking = True
    queue_2 = process_1.create_queue()
    queue_2.name = "TEST_QUEUE_2"
    queue_2.run_order = 2
    queue_2.blocking = True
    process_1.queues.append(queue_1)
    process_1.queues.append(queue_2)
    session.add(process_1)
    session.commit()
    tasks_1 = [
        models.Task(
            file_path = "./executor_files/TESTPROCESS_1/sql_1.sql",
            task_type_id = 1
        ),
        models.Task(
            file_path = "./executor_files/TESTPROCESS_1/sql_2.sql", 
            task_type_id = 1
        ),
        models.Task(
            file_path = "./executor_files/TESTPROCESS_1/sql_3.sql" ,
            task_type_id = 1
        ),
        models.Task(
            file_path = "./executor_files/TESTPROCESS_1/sql_4.sql", 
            task_type_id = 1
        ),
        models.Task(
            file_path = "./executor_files/TESTPROCESS_1/sql_5.sql" ,
            task_type_id = 1
        )
    ]
    tasks_2 = [
        models.Task(
            file_path = "./executor_files/TESTPROCESS_1/sql_6.sql" ,
            task_type_id = 1
        ),
        models.Task(
            file_path = "./executor_files/TESTPROCESS_1/sql_7.sql" ,
            task_type_id = 1
        )
    ]
    session.add_all(tasks_1)
    session.add_all(tasks_2)
    session.commit()
    queues_tasks_1 = [ models.QueueTask( task_id = t.id, queue_id = queue_1.id , run_order = idx, blocking = True) for idx,t in enumerate(tasks_1) ]
    queues_tasks_2 = [ models.QueueTask( task_id = t.id, queue_id = queue_2.id , run_order = idx, blocking = True) for idx,t in enumerate(tasks_2,5) ]
    session.bulk_save_objects(queues_tasks_1)
    session.bulk_save_objects(queues_tasks_2)
    session.commit()
    """"""
    process_2 = models.Process(
        name = 'TESTPROCESS_2',
        description = 'Test process with test tasks and queues 2.',
        logfolder = "./executor_logs/TEST_PROCESS_2"
    )
    session.add(process_2)
    session.commit()
    queue_3 = process_2.create_queue()
    queue_3.name = "TEST_QUEUE_3"
    queue_3.run_order = 1
    queue_3.blocking = False
    queue_4 = process_2.create_queue()
    queue_4.name = "TEST_QUEUE_4"
    queue_4.run_order = 2
    queue_4.blocking = False
    session.add(queue_3)
    session.add(queue_4)
    session.commit()
    tasks_3 = [
        models.Task(
            file_path = "./executor_files/TESTPROCESS_2/sql_1.sql" ,
            task_type_id = 1
        )
    ]
    tasks_4 = [
        models.Task(
            file_path = "./executor_files/TESTPROCESS_2/sql_2.sql" ,
            task_type_id = 1
        )
    ]
    session.add_all(tasks_3)
    session.add_all(tasks_4)
    session.commit()
    queues_tasks_3 = [ models.QueueTask( task_id = t.id, queue_id = queue_3.id , run_order = idx, blocking = True) for idx,t in enumerate(tasks_3) ]
    queues_tasks_4 = [ models.QueueTask( task_id = t.id, queue_id = queue_4.id , run_order = idx, blocking = True) for idx,t in enumerate(tasks_4) ]
    session.bulk_save_objects(queues_tasks_3)
    session.bulk_save_objects(queues_tasks_4)
    session.commit()

if __name__ == "__main__":
    try:
        session = connection.Session()
        db_create_table(session)
        db_fill_tables(session)
        session.commit()
    finally:
        connection.Session.remove()
