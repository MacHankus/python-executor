import pytest
from backend_app import app


@pytest.fixture
def client():
    app.config['DATABASE'] = tempfile.mkstemp()
    app.config['TESTING'] = True

    with app.test_client() as client:
        yield client
