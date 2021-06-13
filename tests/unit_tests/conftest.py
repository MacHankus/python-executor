import pytest
import connection as con

@pytest.fixture
def get_connection():
    """Gives connection"""
    session = con.Session()

    yield session 

    session.close()
    
    con.Session.remove()