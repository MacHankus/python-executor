import pytest
from sqlalchemy.sql.expression import column
import validator_collection 
from resources.pagination import QMFactory, QMType, QueryModifierAbstract, Parser, QueryModifierManager
from resources.query import process_stats_final_query
import models
from sqlalchemy.orm import Query
from validator_collection import validators




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