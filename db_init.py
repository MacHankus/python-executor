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
        )
    ]
    session.bulk_save_objects(task_types)
    session.commit()
    process_1 = models.Process(
        name = 'TESTPROCESS_1',
        description = 'Test process with test tasks and queues.'
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
        description = 'Test process with test tasks and queues 2.'
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

    process_3 = models.Process(
        name = 'TESTPROCESS_3',
        description = 'Test process with test tasks and queues.'
    )
    process_4 = models.Process(
        name = 'TESTPROCESS_4',
        description = 'Test process with test tasks and queues.'
    )
    process_5 = models.Process(
        name = 'TESTPROCESS_5',
        description = 'Test process with test tasks and queues.'
    )
    process_6 = models.Process(
        name = 'TESTPROCESS_6',
        description = 'Test process with test tasks and queues.'
    )
    session.add_all([process_3, process_4, process_5, process_6])
    session.commit()
    queues_3_6 = [process_3.create_queue(),process_4.create_queue(),process_5.create_queue(),process_6.create_queue()]
    tasks_3_6 = []
    queues_3_6_start = 3
    for q in queues_3_6:
        q.name = "TEST_QUEUE_FOR_PROCESS_" + str(queues_3_6_start)
        queues_3_6_start += 1
        q.description = f"Test process with test tasks and queues with number {str(queues_3_6_start)}."
        q.run_order = 1
        q.blocking = True
        session.add(q)
        session.commit()
        for x in range(2):
            new_queue_task =models.QueueTask()
            new_queue_task.blocking = True 
            new_queue_task.queue = q 
            new_task = models.Task()
            new_task.task_type_id = 1
            new_task.file_path = (f"./executor_files/TESTPROCESS_{str(q.process_id)}/sql_{str(x)}.sql")
            session.add(new_task)
            new_queue_task.task = new_task
            new_queue_task.run_order = 1
            new_queue_task.blocking = True 
            session.add(new_queue_task)
        session.commit()
    


if __name__ == "__main__":
    try:
        session = connection.Session()
        db_create_table(session)
        db_fill_tables(session)
        session.commit()
    finally:
        connection.Session.remove()
