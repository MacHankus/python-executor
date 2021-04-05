from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship, backref
import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, BigInteger, CheckConstraint, ForeignKey
from sqlalchemy.sql import text
from sqlalchemy.schema import MetaData

Base = declarative_base()


class MainModel():
    id = Column(BigInteger(), primary_key = True)
    create_date = Column(DateTime(), server_default=text("current_timestamp"))
    mod_date = Column(DateTime())

class DictModel():
    id = Column(BigInteger(), primary_key = True)
    create_date = Column(DateTime(), server_default=text("current_timestamp") )
    mod_date = Column(DateTime())
    name = Column(String(), nullable = False)
    description = Column(String(), nullable = False)

class LogModel():
    id = Column(BigInteger(), primary_key = True)
    start_date = Column(DateTime())
    end_date = Column(DateTime())
    mod_date = Column(DateTime())
    create_date = Column(DateTime())
    blocking = Column(Boolean())
    success = Column(Boolean())
    error_msg = Column(String())

class Process(Base,MainModel):   
    __tablename__="process" 
    name = Column(String(), nullable = False, unique=True)
    description = Column(String(), nullable = False)
    runs = relationship("ProcessRun", lazy="joined")
    queues = relationship("Queue", lazy="joined")
    logfolder = Column(String(),nullable=False)
    def create_run(self):
        return ProcessRun(
            process_id = self.id
        )
    def create_queue(self):
        return Queue(
            process_id = self.id
        )
class ProcessRun(Base,MainModel):
    __tablename__="run"
    process_id = Column(BigInteger(), ForeignKey('process.id'), nullable=False)
    start_date = Column(DateTime(), server_default = text("current_timestamp"))
    end_date = Column(DateTime())
    last_activity_date = Column(DateTime(), default = datetime.datetime.now())
    success = Column(Boolean())
    logs = relationship("ProcessRunLog")

class Queue(Base,MainModel):
    __tablename__="queue"
    process_id = Column(BigInteger(),ForeignKey("process.id"), nullable=False)
    name = Column(String(),nullable=False)
    run_order = Column(BigInteger(),nullable=False)
    blocking = Column(Boolean(), nullable=False)
    queues_tasks = relationship("QueueTask", lazy="joined")
class QueueLog(Base,LogModel):
    __tablename__="queue_log"
    run_id = Column(BigInteger(),ForeignKey('run.id'))
    queue_id = Column(BigInteger(),ForeignKey('queue.id'))

class TaskTypeDict(Base,DictModel):
    __tablename__="d_task_type"
    pass

class Task(Base,MainModel):
    __tablename__="task"
    file_path = Column(String()) 
    code = Column(String()) 
    function = Column(String()) 
    arguments = Column(String())
    task_type_id = Column(BigInteger(),ForeignKey("d_task_type.id"), nullable=False)
    task_type = relationship("TaskTypeDict")
    queues_tasks = relationship("QueueTask")

class QueueTask(Base,MainModel):
    __tablename__="queue_task"
    __table_args__ = (
            CheckConstraint('id != wait_for'),
            )
    task_id = Column(BigInteger(),ForeignKey("task.id"), nullable=False)
    queue_id = Column(BigInteger(),ForeignKey("queue.id"), nullable=False)
    run_order = Column(BigInteger(), nullable=False)
    wait_for = Column(BigInteger())
    blocking = Column(Boolean(),nullable=False)
    task = relationship("Task",back_populates="queues_tasks", lazy="joined")
    queue = relationship("Queue",back_populates="queues_tasks", lazy="joined")

class QueueTaskLog(Base,LogModel):
    __tablename__="queue_task_log"
    run_id = Column(BigInteger(),ForeignKey('run.id'), nullable=False)
    queue_log_id = Column(BigInteger(),ForeignKey('queue_log.id'), nullable=False)
    queue_task_id = Column(BigInteger(),ForeignKey('queue_task.id'), nullable=False)
    queue_id = Column(BigInteger(),ForeignKey('queue.id'), nullable=False)
    task_id = Column(BigInteger(),ForeignKey('task.id'), nullable=False)

class ProcessRunLog(Base,LogModel):
    __tablename__="run_log"
    run_id = Column(BigInteger(),ForeignKey('run.id'), nullable=False)

 