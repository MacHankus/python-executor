from flask import g
from resources.models import statistics_model
from datetime import datetime as dtdt
from functools import wraps
from flask_restx import Resource
from datetime import timezone

class ResourceAdditional(Resource):
    """Class which extends Resource from flask-restx.

    Adding statistics to all responses.
    
    """

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        METHODS = ['GET','POST','HEAD','PUT','DELETE','CONNECT','OPTIONS','TRACE','PATCH']
        for attr in dir(self):
            # Decorate every method in METHODS
            if callable(getattr(self,attr)) and attr.upper() in METHODS:
                setattr(self,attr,self.statistics(getattr(self,attr)))

    @classmethod
    def statistics(self,func):
        @wraps(func)
        def wrapper(*args,**kwargs):
            format = '%Y-%m-%dT%H:%M:%S.%fZ'
            start_date = dtdt.now(tz=timezone.utc)
            returned = func(*args,**kwargs)
            end_date = dtdt.now(tz=timezone.utc)
            stats = {
                'start_date':start_date.strftime(format),
                'end_date':end_date.strftime(format),
                'duration':(end_date - start_date).microseconds,
                'duration_unit':'microseconds'
            }
            if isinstance(returned, tuple):
                data , *additional = returned
                data['statistics'] = stats
                return data,*additional
            elif isinstance(returned, dict):
                data = returned
                data['statistics'] = stats
                return data
            else:
                print("Warning [ResourceAdditional]: Unrecognize object returned.")
                return returned
        return wrapper


def standard_resource_class(namespace,marshal_model, query, as_list = True,envelope = None):
    class Dummy():
        @namespace.marshal_with(marshal_model, as_list=as_list)
        def get(self):
            return self._get()
        def _get(self):
            db_resource = query.with_session(g.session).all()
            dict_result = []
            for x in db_resource:
                dict_result.append(x._asdict())
            print(db_resource)
            print(dict_result,200)
            return dict_result,200
    return Dummy

def result_to_dict(columns,result):
    def check_if_array(test):
        if isinstance(test,tuple) or isinstance(test,list):
            return True 
        return False
    dict_result = None
    if check_if_array(result) and check_if_array(result[0]):
        dict_result = []
        for res in result:
            if not check_if_array(res):
                raise TypeError("Provided result is not list of lists")
            obj = {}
            for idx,key in enumerate(columns):
                obj[key] = res[idx]
            dict_result.append(obj)
        return dict_result
    if check_if_array(result):
        dict_result = {}
        for idx,key in enumerate(columns):
            dict_result[key] = result[idx]
        return dict_result 
        