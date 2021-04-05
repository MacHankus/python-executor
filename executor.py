from logger import create_logger
import models
from connection import Session
import datetime as dt
import os 
from sqlalchemy.orm import joinedload 
from sqlalchemy.sql import text
import threading
import traceback
import argparse 

parser = argparse.ArgumentParser(description='Task executor for sql files, commands and additional python functions.')
parser.add_argument(
    '-id','--processid', 
    dest='process_id',
    required=True, 
    type=int, 
    help='ID of process to run. From db process table.')
args = parser.parse_args()

def split_by_order(arr):
    splitted = {}
    arr.sort(key=lambda x: x.run_order)
    for item in arr:
        if item.run_order not in splitted:
            splitted[item.run_order] = [item]
        else:
            splitted[item.run_order].append(item)
    return splitted

class TaskExecutor():
    def __init__(self,task,session,logger):
        self.task = task 
        self.session = session
        self.logger = logger
    def perform(self):
        self.logger.info('Performing.')
        if self.task.task_type_id == 1:
            self.logger.info('Read sql from file.')
            with open(self.task.file_path,'r') as file:
                read = file.read()
                self.logger.debug(read)
                self.session.execute(read)
            self.logger.info('Read and executed.')
class ThreadSession():
    def __init__(self,Session):
        self.Session = Session 
    def __enter__(self):
        self.session = self.Session() 
        return self.session 
    def __exit__(self,exc_type,exc_value,tb):
        if exc_type:
            self.session.rollback()
        else:
            self.session.commit()
        self.Session.remove()
class LogManager():
    def __init__(self,session,model,logmodel,logger):
        self.model = model
        self.logmodel = logmodel
        self.logmodel.blocking = True 
        self.logmodel.create_date = dt.datetime.now()
        self.session = session 
        self.session.add(self.logmodel)
        self.session.commit()
        self.logger = logger.getChild('logger')
        self.error_msgs = ""
        self.fail = False
        self.logger.info(f"Initialized Logger.")
    def __enter__(self):
        return self
    def start(self):
        self.logger.info(f"Start called.")
        start_date = dt.datetime.now()
        self.logger.info(f"Start")
        self.logmodel.start_date = start_date
        self.logmodel.mod_date = start_date
        self.session.commit()
        self.logger.debug(self.logmodel)
        self.logger.info(f"Start commited.")
    def block(self):
        self.logger.info(f"Block called.")
        self.logmodel.blocking = True 
        self.logmodel.mod_date = dt.datetime.now()
        self.session.commit()
        self.logger.info(f"Block commited.")
    def fail_arr(self,threads_with_errors,name):
        self.logger.info(f"Fail called.")
        self.fail = True
        for x in threads_with_errors:
            self.error_msgs = f"{name} with id:{str(x[0].id)}, error :\n {x[1]}\n-------------------------"
        self.session.commit()
        self.logger.info(f"Fail commited.")
    def __exit__(self,exc_type,exc_value,tb):
        self.logger.info('Exiting from context.')
        self.logmodel.mod_date = dt.datetime.now()
        self.logmodel.end_date = dt.datetime.now()
        if exc_type:
            self.session.rollback()
            self.logger.error(f"Log ended up with error. \n" + traceback.format_exc())
            self.logmodel.success = False 
            self.logmodel.error_msg = traceback.format_exc()
            self.logger.error(f"Error logged in db.")
        elif self.fail:
            self.logger.error(f"Detected errors in inner threads.")
            self.logmodel.success = False 
            self.logmodel.error_msg = self.error_msgs
            self.logger.error(f"Inner errors logged in db.")
        else:
            self.logger.info('Process succeeded.')
            self.logmodel.success = True
        self.logmodel.blocking = False
        self.session.commit()
        self.logger.info(f"Log ended.")

class MainThread():
    def __init__(self,Session):
        self.Session = Session
    def thread_session_context(self):
        return ThreadSession(self.Session)

class QueueTaskThread(threading.Thread,MainThread):
    def __init__(self, threadID, queue_task,run,queue_log,queue, Session,logger,threads_with_errors):
        threading.Thread.__init__(self)
        MainThread.__init__(self,Session)
        self.threadID = threadID
        self.queue_task = queue_task
        self.queue_log = queue_log
        self.queue = queue
        self.run_object = run
        self.threads_with_errors = threads_with_errors
        self.logger = logger.getChild(f"queue_task-{self.queue_task.task_id}")
    def run(self):
        self.logger.info('Running.')
        with self.thread_session_context() as session:
            with LogManager(session,self.queue_task,models.QueueTaskLog(**{'run_id':self.run_object.id,'queue_task_id':self.queue_task.id,'task_id':self.queue_task.task_id, 'queue_id':self.queue_task.queue_id,'queue_log_id':self.queue_log.id}),self.logger) as log:
                try:
                    log.start()
                    self.logger.info('Started.')
                    if self.queue_task.blocking:
                        self.logger.info('Blocking.')
                        log.block()
                    TE = TaskExecutor(self.queue_task.task,session,self.logger)
                    TE.perform()
                    self.logger.info('Executed.')
                except Exception as e:
                    session.rollback()
                    self.threads_with_errors.append((self.queue_task,str(e)))
                    raise e
        self.logger.info('Ended.')
class QueueThread(threading.Thread,MainThread):
    def __init__(self, threadID, queue,run, Session,logger):
        threading.Thread.__init__(self)
        MainThread.__init__(self,Session)
        self.threadID = threadID
        self.queue = queue
        self.run_object = run
        self.logger = logger.getChild(f"queue-{self.queue.id}")
        self.left_threads = []
        self.threads_with_errors = []
        self.logger.info('Initialized.')
    def run(self):
        self.logger.info('Started.')
        with self.thread_session_context() as session:
            with LogManager(session,self.queue,models.QueueLog(**{'run_id':self.run_object.id,'queue_id':self.queue.id}),self.logger) as log:
                log.start()
                splitted_tasks = split_by_order(self.queue.queues_tasks)
                for key,val in splitted_tasks.items():
                    if len(self.threads_with_errors)>0:
                        self.logger.info('threads_with_errors not empty')
                        log.fail_arr(self.threads_with_errors, 'queue_task')
                        self.logger.debug(self.threads_with_errors)
                        break
                    threads = []
                    for task in val: 
                        TT = QueueTaskThread('',task,self.run_object,log.logmodel,self.queue,self.Session,self.logger,self.threads_with_errors)
                        TT.start()
                        if task.blocking:
                            self.logger.info(f" Task.id: '{str(task.id)}' added to blocking in same run order.")
                            threads.append(TT)
                        else:
                            self.logger.info(f" Task.id: '{str(task.id)}' not blocking anything. Adding it to left threads.")
                            self.left_threads.append(TT)
                    [x.join() for x in threads]
                [x.join() for x in self.left_threads]
                if len(self.threads_with_errors)>0:
                    self.logger.info('threads_with_errors not empty')
                    log.fail_arr(self.threads_with_errors, 'queue_task')
                    self.logger.debug(self.threads_with_errors)
        self.logger.info('Ended.')
            
class MainExecutor():
    def __init__(self,id):
        self.id = id 
        self.Session = Session
        self.session = Session()
        self.process = self.session.query(models.Process).options(joinedload('queues').joinedload('queues_tasks').joinedload('task')).filter(models.Process.id == self.id).first()
        if not self.process:
            raise Exception(f"Can't find process with id ='{self.id}'")
        self.logger = create_logger(self.process.name, os.path.join(self.process.logfolder, dt.datetime.now().strftime("%Y%m%d_%H%M%S")))
        self.logger.info(f"Executor initiated for process with id = '{self.id}'")
        self.logger.debug(self.process)
        self.left_threads = []
        self.threads_with_errors = []
    def prepare(self):
        self.logger.info('Creating Run instance.')
        self.run = self.process.create_run()
        self.session.add(self.run)
        self.session.commit()
        self.logger.info('Run saved in db.')
        self.logger.debug(self.run)
    def execute(self):
        self.logger.info("Executing.")
        splitted_queues = split_by_order(self.process.queues)
        if not splitted_queues:
            self.logger.error("Splitted queues is empty.")
            raise Exception("Splitted queues is empty.")
        for key,val in splitted_queues.items():
            threads = []
            for queue_item in val: 
                QT = QueueThread('',queue_item,self.run,self.Session,self.logger)
                QT.start()
                if queue_item.blocking:
                    self.logger.info(f" Queue.id: '{str(queue_item.id)}' added to blocking in same run order.")
                    threads.append(QT)
                else:
                    self.logger.info(f" Queue.id: '{str(queue_item.id)}' not blocking anything. Adding it to left threads.")
                    self.left_threads.append(QT)
            
            [ (x.join(),self.logger.info(f"Joined Queue.id: '{str(x.queue.id)}'")) for x in threads]
        [x.join() for x in self.left_threads]
        print('end')

                



ex = MainExecutor(2)
ex.prepare()
ex.execute()