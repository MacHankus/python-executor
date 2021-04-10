from flask import Flask, g
from flask_cors import CORS
from connection import Session
from backend_app_extensions import  api

app = Flask(__name__)
api.init_app(app)

cors = CORS(app, resources={r".*": {"origins": "http://localhost:*"}})

@app.before_request
def setup():
    session = Session()
    g.session = session 
    g.Session = Session

@app.after_request
def finish(resp):
    if g.Session: g.Session.remove()
    return resp

if __name__ == '__main__':
    app.run(debug=True)