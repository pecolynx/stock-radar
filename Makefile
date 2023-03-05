PANTS:=pants
STOCK_RADAR_APP_NAME:=stock_radar_app
STOCK_RADAR_APP_IMAGE:=stock-radar-app

SHELL=/bin/bash

.PHONY: all
all:
	$(PANTS) check ::
	$(PANTS) lint ::
	$(PANTS) fmt ::

.PHONY: tailor
tailor:
	$(PANTS) tailor ::

.PHONY: tailor-check
tailor-check:
	$(PANTS) tailor --check ::

.PHONY: fmt
fmt:
	$(PANTS) fmt ::

.PHONY: check
check:
	$(PANTS) check ::

.PHONY: lint
lint:
	$(PANTS) lint ::

.PHONY: generate-lockfiles
generate-lockfiles:
	$(PANTS) generate-lockfiles

.PHONY: package
package:
	$(PANTS) package ::

.PHONY: update-build-files
update-build-files:
	$(PANTS) update-build-files ::

#
# stock-radar-frontend
#
build-stock-radar-frontend:
	rm -rf python/${STOCK_RADAR_APP_IMAGE}/${STOCK_RADAR_APP_NAME}/statics/*
	pushd typescript/stock-radar-frontend && npm run build && popd
	cp -r typescript/stock-radar-frontend/dist/* python/${STOCK_RADAR_APP_IMAGE}/${STOCK_RADAR_APP_NAME}/statics/
	cp python/${STOCK_RADAR_APP_IMAGE}/template/__init__.py.statics python/${STOCK_RADAR_APP_IMAGE}/${STOCK_RADAR_APP_NAME}/statics/__init__.py
	cp python/${STOCK_RADAR_APP_IMAGE}/template/BUILD.statics python/${STOCK_RADAR_APP_IMAGE}/${STOCK_RADAR_APP_NAME}/statics/BUILD


#
# stock-radar-app
#
.PHONY: package-stock-radar-app
package-stock-radar-app:
	$(PANTS) package python/${STOCK_RADAR_APP_IMAGE}:

.PHONY: run-stock-radar-app-binary
run-stock-radar-app-binary:
	$(PANTS) run python/${STOCK_RADAR_APP_IMAGE}:${STOCK_RADAR_APP_IMAGE}

.PHONY: run-stock-radar-app
run-stock-radar-app:
	$(PANTS) run python/${STOCK_RADAR_APP_IMAGE}/stock_radar_app/main.py
