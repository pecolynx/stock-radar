PANTS=./pants

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

.PHONY: package-stock-radar-app
package-s-radar-app:
	$(PANTS) package stock-radar-app:

.PHONY: update-build-files
update-build-files:
	$(PANTS) update-build-files ::

.PHONY: run-stock-radar-app-binary
run-s-radar-app-binary:
	$(PANTS) run python/stock-radar-app:stock-radar-app

.PHONY: run-stock-radar-app
run-s-radar-app:
	$(PANTS) run python/stock-radar-app/stock_radar_app/main.py
