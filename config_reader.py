import yaml

def get_configuration_dict():
    with open("config.yaml", 'r') as stream:
        return yaml.safe_load(stream) 
