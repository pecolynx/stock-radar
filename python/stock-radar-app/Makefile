CMD:=poetry run
APP_NAME:=stock_radar_app
IMAGE_NAME:=stock-radar-app
SHELL=/bin/bash

build-frontend:
	rm -rf static/*
	pushd stock-radar-frontend && npm run build && popd
	cp -r stock-radar-frontend/dist/* static/

uvicorn:
	CONFIG_FILE_PATH=stock_radar_app/config/config.yml \
	DEBUG_MODE=1 \
	$(CMD) uvicorn $(APP_NAME).main:app --reload --log-config stock_radar_app/config/uvicorn-log.yml
	# $(CMD) uvicorn $(APP_NAME).main:app --reload --log-config stock_radar_app/config/uvicorn-log.yml

test:
	$(CMD) pytest --cov=$(APP_NAME) --cov-branch --cov-report=html

docker-build:
	docker build --file Dockerfile -t $(IMAGE_NAME) .

docker-run:
	docker run -p 50051:50051 $(IMAGE_NAME)

dev-docker-up:
	@docker-compose -f docker/development/docker-compose.yml up -d

dev-docker-down:
	@docker-compose -f docker/development/docker-compose.yml down

test-docker-up:
	@docker-compose -f docker/test/docker-compose.yml up -d

test-docker-down:
	@docker-compose -f docker/test/docker-compose.yml up

dev-db-migrate:
	$(CMD) alembic upgrade head
