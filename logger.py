import logging 
import sys

def create_logger(app_name, file_name):
    # create logger with 'spam_application'
    logger = logging.getLogger('app_name')
    logger.setLevel(logging.DEBUG)
    # create file handler which logs even debug messages
    fh = logging.FileHandler(file_name)
    fh.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s {%(name)s}[%(levelname)s]: %(message)s')
    fh.setFormatter(formatter)
    # add the handlers to the logger
    logger.addHandler(fh)

    stdout_hdlr = logging.StreamHandler(sys.stdout)
    #stderr_hdlr = logging.StreamHandler(sys.stderr)
    stdout_hdlr.setLevel(logging.DEBUG)
    #stderr_hdlr.setLevel(logging.DEBUG)
    stdout_hdlr.setFormatter(formatter)
    #stderr_hdlr.setFormatter(formatter)
    logger.addHandler(stdout_hdlr)
    #logger.addHandler(stderr_hdlr)
    return logger

