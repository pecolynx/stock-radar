import json
import logging


def get_app_log(record):
    json_obj = {
        "name": record.name,
        "level": record.levelname,
        "type": "app",
        "timestamp": record.asctime,
        "pathname": record.pathname,
        "line": record.lineno,
        "threadId": record.thread,
        "message": record.message,
        "stack": record.stack_info,
    }

    return json_obj


class JsonFormatter(logging.Formatter):
    def format(self, record):
        logging.Formatter.format(self, record)
        return json.dumps(get_app_log(record))


def init_json_logger():
    formatter = JsonFormatter("%(asctime)s")
    log_handler = logging.StreamHandler()
    log_handler.setFormatter(formatter)

    logging.basicConfig(handlers=[log_handler], level=logging.INFO)

    sql_logger = logging.getLogger("sqlalchemy.engine.Engine")
    sql_logger.handlers.clear()
    sql_logger.propagate = False
    sql_logger.addHandler(log_handler)
    sql_logger.setLevel(logging.INFO)

    uvicorn_logger = logging.getLogger("uvicorn")
    uvicorn_logger.handlers.clear()
    uvicorn_logger.propagate = False
    uvicorn_logger.addHandler(log_handler)
    uvicorn_logger.setLevel(logging.INFO)

    gunicorn_logger = logging.getLogger("gunicorn")
    gunicorn_logger.handlers.clear()
    gunicorn_logger.propagate = False
    gunicorn_logger.addHandler(log_handler)
    gunicorn_logger.setLevel(logging.INFO)


def init_plaintext_logger():
    logging.basicConfig(level=logging.INFO)

    sql_logger = logging.getLogger("sqlalchemy.engine.Engine")
    sql_logger.handlers.clear()
    sql_logger.propagate = False
    sql_logger.setLevel(logging.INFO)
