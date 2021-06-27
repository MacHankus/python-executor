import base64
import pytest
from sqlalchemy.sql.expression import column
from sqlalchemy.util.compat import b64encode
import validator_collection
from resources.pagination import ColumnDescription, QMFactory, QMType, QueryModifierAbstract, Parser, QueryModifierManager, Limit, Cursor
from resources.query import process_stats_final_query
import models
from sqlalchemy.orm import Query
from validator_collection import validators
import datetime as dt
import models


@pytest.mark.parametrize(
    'type',[
        pytest.param('gt')
        ,pytest.param('gte')
        ,pytest.param('lt')
        ,pytest.param('lte')
        ,pytest.param('regexp')
        ,pytest.param('eq')
        ,pytest.param('like')
        ,pytest.param('like4',  marks=pytest.mark.xfail)
    ]
)
def test_QMFactory(type):
    """Checks if QMFactory creating correct QM that is instance of abstract parent"""
    _type = QMType[type]
    qmfactory = QMFactory()
    qm = qmfactory.createQM(_type)
    assert isinstance(qm,QueryModifierAbstract), "Created QM is not subclasss of QueryModifierAbstract."
    assert hasattr(qm,'apply_filter'), "QM hasnt got method apply_fiter."

def test_QMFactory_fail():
    """Checks if fail when wrong type provided in createQM"""
    with pytest.raises(TypeError) as excinfo:
        qmfactory = QMFactory()
        qm = qmfactory.createQM(9999999)
    assert "Type not in defined types in QMTypes." in str(excinfo.value)


@pytest.mark.parametrize(
    'text,operator,value',[
        pytest.param('gt:1','gt','1'),
        pytest.param('gte:column_value','gte','column_value'),
        pytest.param('gte:',None,None),
        pytest.param('column_name',None,None)
    ]
)
def test_Parser(text,operator,value):
    parser = Parser(text)
    parser.analyze()
    print(parser.operator)
    assert parser.operator == operator 
    assert parser.value == value 
@pytest.mark.parametrize(
    'text,operator,value',[
        pytest.param('gt:2','gt','2'),
        pytest.param('gte:column_value','gte','column_value'),
        pytest.param('lt:fdgh','lt','fdgh'),
    ]
)
def test_Parser_get_QM_instance_of_QueryModifierAbstract(text,operator,value):
    parser = Parser(text)
    parser.analyze()
    print(parser.get_QM())
    assert isinstance(parser.get_QM(),QueryModifierAbstract)

@pytest.mark.parametrize(
    'text',[
        pytest.param('gt7:2'),
        pytest.param('column_value'),
        pytest.param('lt:'),
    ]
)
def test_Parser_get_QM_is_None(text):
    parser = Parser(text)
    parser.analyze()
    assert parser.get_QM() is None

@pytest.mark.parametrize(
    'required_params, added_part',
    [
        pytest.param(
            [
                (
                    process_stats_final_query.column_descriptions[0]['expr'], # id
                    'gte:1',
                    validators.integer
                )
            ],
            'where just_process.id >= 1'
        ),
        pytest.param(
            [
                (
                    process_stats_final_query.column_descriptions[0]['expr'], # id
                    'gte:1',
                    validators.integer
                ),
                (
                    process_stats_final_query.column_descriptions[0]['expr'], # id
                    'lte:10',
                    validators.integer
                )
            ],
            'where just_process.id >= 1 and just_process.id <= 10'
        ),
        pytest.param(
            [
                (
                    process_stats_final_query.column_descriptions[1]['expr'], # id
                    'eq:TEST_NAME',
                    validators.string
                )
            ],
            'where just_process.name = \'TEST_NAME\''
        ),
        pytest.param(
            [
                (
                    process_stats_final_query.column_descriptions[5]['expr'], # id
                    'eq:2021-01-01T00:00:00',
                    validators.datetime
                )
            ],
            'where lasts.last_start_date = \'2021-01-01 00:00:00\''
        ),
        pytest.param(
            [
                (
                    process_stats_final_query.column_descriptions[5]['expr'], # id
                    'eq:2021-01-01 00:00:00',
                    validators.datetime
                )
            ],
            'where lasts.last_start_date = \'2021-01-01 00:00:00\''
        ),
        pytest.param(
            [
                (
                    process_stats_final_query.column_descriptions[5]['expr'], # id
                    'eq:2021-01-01',
                    validators.datetime
                )
            ],
            'where lasts.last_start_date = \'2021-01-01 00:00:00\''
        ),
        pytest.param(
            [
                (
                    process_stats_final_query.column_descriptions[5]['expr'], # id
                    'eq:2021-01-0',
                    validators.datetime
                )
            ],
            'where lasts.last_start_date = \'2021-01-01 00:00:00\'',
            marks=pytest.mark.xfail(strict=True)
        ),
        pytest.param(
            [
                (
                    process_stats_final_query.column_descriptions[0]['expr'], # id
                    'eq:fgfd',
                    validators.integer
                )
            ],
            '',
            marks=pytest.mark.xfail(strict=True)
        )
    ],
)
def test_QueryModifierManager_one_query_change(required_params,added_part):
    query  = process_stats_final_query
    qmm = QueryModifierManager(query)
    for column, equality_string, validator in required_params:
        qmm.modify(column, equality_string, validator)
    
    new_query = qmm.query
    compiled = str(new_query.statement.compile(compile_kwargs={"literal_binds": True})).lower()
    length = len(added_part)
    #get added query part - it should be the last characters
    compiled_part = compiled[-length:]
    assert compiled_part == added_part.lower()

@pytest.mark.parametrize(
    'default_value, min, max, validator, value, expected',
    [
        pytest.param(
            10,
            1,
            20,
            validators.integer,
            '12',
            12
        ),
        pytest.param(
            10,
            1,
            20,
            validators.integer,
            '',
            10
        ),
        pytest.param(
            10,
            1,
            20,
            validators.integer,
            None,
            10
        ),
        pytest.param(
            10,
            1,
            20,
            validators.integer,
            None,
            22,
            marks=pytest.mark.xfail(strict = True)
        ),
        pytest.param(
            10,
            1,
            20,
            validators.integer,
            None,
            0,
            marks=pytest.mark.xfail(strict = True)
        )
    ]
)
def test_Limit( default_value, min, max, validator, value, expected):
    limit = Limit(default_value, min, max, validator)
    limit.value = value
    assert limit.value == expected

#expect is dict here to make it simpler
@pytest.mark.parametrize(
    "name, expression, validator, cursor",
    [
        pytest.param(
            'id',
            models.Process.id,
            validators.integer,
            Cursor(0,None,None,None),
        )
    ]
)
def test_ColumnDescription(name, expression, validator, cursor):
    cd = ColumnDescription().add(name, expression, validator, cursor)
    
    for cdname, cdexpression, cdvalidator in cd :
        cdname == name 
        cdexpression = expression
        cdvalidator = validator

    cursor = cd.cursor
    cursor.name == name 
    cursor.expression = expression
    cursor.validator = validator


@pytest.mark.parametrize(
    'default_value, name, validator, expression, value, expected',
    [
        pytest.param(
            0,
            'id',
            validators.integer,
            process_stats_final_query.column_descriptions[0]['expr'],
            base64.b64encode('5'.encode('utf-8')).decode(),
            5
        ),
        pytest.param(
            0,
            'id',
            validators.integer,
            process_stats_final_query.column_descriptions[0]['expr'],
            base64.b64encode('300'.encode('utf-8')).decode(),
            300
        ),
        pytest.param(
            0,
            'id',
            validators.string,
            process_stats_final_query.column_descriptions[0]['expr'],
            base64.b64encode('ID0123'.encode('utf-8')).decode(),
            'ID0123'
        ),
        pytest.param(
            0,
            'id',
            validators.string,
            process_stats_final_query.column_descriptions[0]['expr'],
            base64.b64encode('ID0123'.encode('utf-8')).decode(),
            'ID0123'
        ),
        pytest.param(
            0,
            'id',
            validators.datetime,
            process_stats_final_query.column_descriptions[0]['expr'],
            base64.b64encode('2021-01-01T00:00:00'.encode('utf-8')).decode(),
            dt.datetime(2021,1,1)
        ),
        pytest.param(
            0,
            'id',
            validators.integer,
            process_stats_final_query.column_descriptions[0]['expr'],
            base64.b64encode('agzd'.encode('utf-8')).decode(),
            'AGZD',
            marks=pytest.mark.xfail(strict=True)
        )
    ]
)
def test_Cursor(default_value, name, validator, expression, value, expected):
    cursor = Cursor(default_value, name, validator, expression)
    cursor.value = value
    assert cursor.value == expected