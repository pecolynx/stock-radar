FROM python:3.9-slim-buster

WORKDIR /opt/app

COPY python.stock-radar-app/stock-radar-app.pex /opt/app/stock-radar-app.pex

ENTRYPOINT ["/bin/bash", "-c", "/opt/app/stock-radar-app.pex"]
