from typing import Type
from sqlalchemy.orm import Query
from sqlalchemy import text
import abc
import re 
from enum import Enum
from validator_collection import validators, checkers, errors
from flask import request



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
    def add(self,name, expression, validator):
        self.descriptions[name] = name, expression, validator
        return self
    def __iter__(self):
        for key in self.descriptions:
            yield self.descriptions[key]


class Pagination():
    """Pagination is used not only for pagination with cursor but for filtering too.

    Get posibility to filter your query by given arguments in your api request.
    Schema of request should be like : https://some.api/some/endpoint?column=operator:value&other_column=other_operator:other_value .
    All of the operators are available under this class : QMType.
    Pagination needs to be initialized with three arguments - some kind of configuration for concrete endpoint function and query that function use.

    Args:
        query (sqlalchemy.orm.Query): Query that will be modified with given arguments from request.
        cursor_name (str): Name of the column that will be cursor for pagination module.
        columns_description (ColumnDescription): Object that provides configuration for all columns that should be available for api users.

    Example:
        Decorate you endpoint function to make paginated_query available inside of it:
        >>> @api.route('/someEndpoint')
        >>> class SomeEndpointResource(Resource):
        >>>     @Pagination(
        >>>         #provide query to be paginated/filtered
        >>>         sqlalchemy.orm.Query(models.SomeModel),
        >>>         #specify cursor name here, and in description also
        >>>         'id',
        >>>         #specify all available columns here that will be used in filtering or as cursor
        >>>         ColumnDescription() \\
        >>>             .add('id', models.SomeModel.id, validators.integer) \\
        >>>             .add('name', models.SomeModel.name, validators.integer)
        >>>     )
        >>>     def get(self, paginated_query=None):
        >>>         result = pagination_query.with_session(g.session).all()
        >>>         return result , 200

    """
    def __init__(self,query, cursor_name, columns_description):
        if not isinstance(query, Query):
            raise TypeError("query should be instance of sqlalchemy's Query.")
        self.query = query 
        self.cursor_name = cursor_name 
        self.columns_description = columns_description
    def __call__(self, function, *args, **kwargs):

        def wrapper(*args, **kwargs):
            qmm = QueryModifierManager(self.query)
            for col, expr, valid in self.columns_description:
                valuelist = request.args.getlist(col)
                
                for val in valuelist:
                    qmm.modify(expr, val, valid)

            returned = function(paginated_query = qmm.query, *args, **kwargs)
            return returned 
        return wrapper