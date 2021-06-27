from sqlalchemy.orm import Query
from sqlalchemy import text
import abc
import re 
from enum import Enum
from validator_collection import validators, checkers, errors
from flask import request, g
import base64 
from resources.common import put_object_into_response
import urllib.parse as urlparse

class QueryModifierAbstract(abc.ABC):
    query = None 
    @abc.abstractmethod
    def apply_filter(self,name, value):
        pass

class QMGreater(QueryModifierAbstract):
    def apply_filter(self,name, value):
        self.query = self.query.filter(name > value )
class QMGreaterEqual(QueryModifierAbstract):
    def apply_filter(self,name, value):
        self.query = self.query.filter(name >= value )
class QMLess(QueryModifierAbstract):
    def apply_filter(self,name, value):
        self.query = self.query.filter(name < value )
class QMLessEqual(QueryModifierAbstract):
    def apply_filter(self,name, value):
        self.query = self.query.filter(name <= value )
class QMRegexp(QueryModifierAbstract):
    def apply_filter(self,name, value):
        self.query = self.query.filter(text(name + ' ~ :reg')).params(reg=value)
class QMEqual(QueryModifierAbstract):
    def apply_filter(self,name, value):
        self.query = self.query.filter(name == value)
class QMLike(QueryModifierAbstract):
    def apply_filter(self,name, value):
        self.query = self.query.filter(name.like(value))
        

class QMType(Enum):
    gt = 1
    gte = 2 
    lt = 3
    lte = 4
    regexp = 5
    eq = 6
    like = 7

class QMFactory():
    """Simple Factory to create QueryModifierAbstract

    Returns:
        QueryModifierAbstract

    Raises:
        TypeError: If provided value is not in QMType.

    """
    def createQM(self,type):
        if type == QMType.gt:
            return QMGreater()
        if type == QMType.gte:
            return QMGreaterEqual()
        if type == QMType.lt:
            return QMLess()
        if type == QMType.lte:
            return QMLessEqual()
        if type == QMType.regexp:
            return QMRegexp()
        if type == QMType.eq:
            return QMEqual()
        if type == QMType.like:
            return QMLike()
        raise TypeError(f"Type not in defined types in QMTypes.")

class Parser():
    """Main task is to produce operator and value from provided string and validate value with given python type.
    
    Examples:
        Normal usage with correct values provided ::

            >>>parser = Parser('gte:20')
            >>>parser.analyze()
            >>>print(parser.operator, parser.value)
            gte 20

        Example with incorrect values::

            >>>parser = Parser('gte:') ## parser = Parser('someValue') or parser = Parser('gteee:Value')  etc..
            >>>parser.analyze()
            >>>print(parser.operator, parser.value)
            None None
    Raises:
        TypeError: From nested QMFactory - occurs only when type is different one of QMType enum values.
        
    """
    regexp = r'({operator}):([^$]+)$'
    operator = None 
    value = None
    def __init__(self,text):
        self.text = text
    def analyze(self):
        """Analyzes provided text and creating operator and value after analysis."""
        # Using enum here.
        for item in  QMType:
            match = re.search(self.regexp.format(operator=item.name), self.text)
            if not match : 
                continue
            self.operator = item.name
            self.value = match.group(2)
            return
    
    def get_QM(self):
        """Use to get QueryModifier.
        
        Returns:
            QueryModifierAbstract: Subclass of QueryModifierAbstract.
        """
        qm_factory = QMFactory()
        if self.operator: 
            return qm_factory.createQM(getattr(QMType,self.operator))

class QueryModifierManager():
    """Takes Query which will be modified by modify method."""
    def __init__(self,query):
        self.query = query 
        self.qm_factory = QMFactory()
    def modify(self,column, equality_string, validator):
        """Modifies query. It's more like Facade under which Parser and QMFactory is used.
        
        Args:
            column (object): Column expression used when modyfing sqlalchemy query.
            equality_string (str): Equality string which comes from request query.
            validator (object): Function that validates value from string.

        """
        parser = Parser(equality_string)
        parser.analyze()
        operator = parser.operator 
        #Validate and return value with python type
        value = validator(parser.value)
        qm = self.qm_factory.createQM(getattr(QMType,operator))
        if qm:
            qm.query = self.query
            qm.apply_filter(column,value)
            self.query = qm.query

class ColumnDescription():
    def __init__(self):
        self.descriptions = {}
        self.cursor = None
    def add(self,name, expression, validator, cursor = None):
        if cursor :
            cursor.validator = validator
            cursor.name = name
            cursor.expression = expression
            if self.cursor: raise ValueError('Cursor has been already defined.')
            self.cursor = cursor

        self.descriptions[name] = name, expression, validator

        return self

    def __iter__(self):
        for key in self.descriptions:
            yield self.descriptions[key]

class Cursor():
    def __init__(self, default_value, name, validator, expression):
        self.default_value = default_value
        self.name = name
        self.validator = validator
        self.expression = expression
    @property
    def value(self):
        return self._value
    @value.setter
    def value(self,val):
        if val is None or val == '':
            self._value = self.default_value
            return
        val = base64.b64decode(val.encode('utf-8')).decode()
        self._value = self.validator(val)

class Limit():
    def __init__(self, default_value, min, max, validator):
        self.default_value = default_value
        self.validator = validator
        self.min = min 
        self.max = max
    @property
    def value(self):
        return self._value
    @value.setter
    def value(self,val):
        if val is None or val == '':
            self._value = self.default_value
            return 
        val = urlparse.unquote(val)
        self._value = self.validator(val, minimum=self.min, maximum=self.max)

class Pagination():
    """Pagination is used not only for pagination with cursor but for filtering too.

    Get posibility to filter your query by given arguments in your api request.
    Schema of request should be like : https://some.api/some/endpoint?column=operator:value&other_column=other_operator:other_value .
    All of the operators are available under this class : QMType.
    Pagination needs to be initialized with three arguments - some kind of configuration for concrete endpoint function and query that function use.

    Args:
        query (sqlalchemy.orm.Query): Query that will be modified with given arguments from request.
        limit (Limit): Limit with configuration values.
        columns_description (ColumnDescription): Object that provides configuration for all columns that should be available for api users.

    Example:
        Decorate you endpoint function to make paginated_query available inside of it:
        >>> @api.route('/someEndpoint')
        >>> class SomeEndpointResource(Resource):
        >>>     @Pagination(
        >>>         #provide query to be paginated/filtered
        >>>         sqlalchemy.orm.Query(models.SomeModel),
        >>>         #specify limit
        >>>         Limit(...args)
        >>>         #specify all available columns here that will be used in filtering or as cursor
        >>>         ColumnDescription() \\
        >>>             .add('id', models.SomeModel.id, validators.integer, cursor=Cursor('default_value',...)) \\
        >>>             .add('name', models.SomeModel.name, validators.integer)
        >>>     )
        >>>     def get(self, paginated_query_result=None):
        >>>         return paginated_query_result , 200

    """
    def __init__(self,query, limit, columns_description):
        if not isinstance(query, Query):
            raise TypeError("query should be instance of sqlalchemy's Query.")
        self.query = query 
        self.cursor = columns_description.cursor 
        self.limit = limit 
        self.columns_description = columns_description

    def __call__(self, function, *args, **kwargs):
        """Decorator"""
        def wrapper(*args, **kwargs):
            limit_raw = request.args.get('limit')
            self.limit.value = limit_raw

            cursor_raw = request.args.get('cursor')
            self.cursor.value = cursor_raw

            qmm = QueryModifierManager(self.query)
            for col, expr, valid in self.columns_description:
                valuelist = request.args.getlist(col)
                
                for val in valuelist:
                    qmm.modify(expr, val, valid)
            query = qmm.query
            query = query.filter(self.cursor.expression >= self.cursor.value)
            query = query.order_by(self.cursor.expression)
            query = query.limit(self.limit.value + 1)

            query_result = query.with_session(g.session).all()

            if len(query_result) > self.limit.value:
                next_cursor = str(getattr(query_result[-1], self.cursor.name))
                query_result = query_result[:-1]
            else:
                next_cursor = None

            #eliminate last row, last row its only for nxt cursor
            

            returned = function(paginated_query_result = query_result, *args, **kwargs)

            cursor_info = {
                'name': self.cursor.name,
                'value': base64.b64encode(str(self.cursor.value).encode()).decode(),
                'next_value': base64.b64encode(next_cursor.encode()).decode() if next_cursor else None
            }

            returned = put_object_into_response(returned,'cursor',cursor_info)

            return returned 
        return wrapper