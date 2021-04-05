from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,scoped_session
from config_reader import get_configuration_dict
from sqlalchemy import MetaData

conn_details = get_configuration_dict()['connection']['test']
engine = create_engine(f"postgresql://{conn_details['user']}:{conn_details['password']}@{conn_details['host']}:{conn_details['port']}/{conn_details['databaseName']}?application_name={conn_details['application']}", echo=True)
print(f"postgresql://{conn_details['user']}:{conn_details['password']}@{conn_details['host']}:{conn_details['port']}/{conn_details['databaseName']}?application_name={conn_details['application']}")
session_factory = sessionmaker(bind=engine)

Session = scoped_session(session_factory)
