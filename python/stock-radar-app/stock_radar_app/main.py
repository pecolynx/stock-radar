import logging
import os
from importlib import resources

import pandas
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from prometheus_fastapi_instrumentator import Instrumentator
from pyaml_env import parse_config
from sqlalchemy.sql import text
from stock_radar_app.config.container import Container
from stock_radar_app.controller import chart_controller, healthcheck_controller
from stock_radar_app.log import log

debug_mode = os.getenv("DEBUG_MODE")

# config
config_text = ""
if debug_mode:
    with open("stock_radar_app/config/config.yml", encoding="utf-8") as f:
        config_text = f.read()
else:
    config_text = resources.read_text("stock_radar_app.config", "config.yml")

config_dict = parse_config(data=config_text)
print(config_dict)


if debug_mode:
    df7230 = pandas.read_csv("stock_radar_app/data/7230.T.csv")
else:
    with resources.path("stock_radar_app.data", "7230.T.csv") as df:
        df7230 = pandas.read_csv(df)
print("HELLOx")
print(df7230)

# container
container = Container()
container.config.from_dict(config_dict)

# tracing
resource = Resource(attributes={SERVICE_NAME: "your-service-name"})

jaeger_exporter = JaegerExporter(
    agent_host_name="localhost",
    agent_port=6831,
)

provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(jaeger_exporter)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

# logging
if config_dict["logging"]["format"] == "JSON":
    log.init_json_logger()
else:
    log.init_plaintext_logger()

logger = logging.getLogger(__name__)

# app
app = FastAPI()
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chart_controller.router)
app.include_router(healthcheck_controller.router)

if debug_mode:
    app.mount(
        "", StaticFiles(directory="stock_radar_app/statics", html=True), name="static"
    )
else:
    app.mount("", StaticFiles(packages=["stock_radar_app"], html=True), name="static")

# metrics
Instrumentator(
    excluded_handlers=["/metrics"],
).instrument(
    app
).expose(app=app, endpoint="/metrics")

db = container.db()
with db.session() as session:
    session.execute(text("select 1"))
    session.commit()


def main():
    uvicorn.run("stock_radar_app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
