import pytest
from resources.common import result_to_dict


@pytest.mark.parametrize("columns,result,expected",
                         [
                            #1
                            #columns
                            (['id', 'name', 'desc'], 
                            #result
                            [
                                (1, 'name1', 'desc1'),
                                (2, 'name2', 'desc2'),
                                (3, 'name3', 'desc3')
                            ],
                            #expected
                            [ 
                                {'id':1,'name':'name1','desc':'desc1'},
                                {'id':2,'name':'name2','desc':'desc2'},
                                {'id':3,'name':'name3','desc':'desc3'},
                            ]),
                            #2
                            #columns
                            (['id', 'name', 'desc'],
                            #result
                                (4,'name4','desc4'),
                            #expected
                                {'id':4,'name':'name4','desc':'desc4'},
                            ),
                            #3
                            #columns
                            (['id', 'name_test', 'desc_test'], 
                            #result
                            [
                                [1, 'name_test1', 'desc_test1'],
                                [2, 'name_test2', 'desc_test2'],
                                [3, 'name_test3', 'desc_test3']
                            ],
                            #expected
                            [ 
                                {'id':1,'name_test':'name_test1','desc_test':'desc_test1'},
                                {'id':2,'name_test':'name_test2','desc_test':'desc_test2'},
                                {'id':3,'name_test':'name_test3','desc_test':'desc_test3'},
                            ]),
                         ])
def test_result_to_dict(columns, result, expected):
    assert result_to_dict(columns, result) == expected
