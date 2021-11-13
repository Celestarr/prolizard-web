.PHONY: test

reset:
	docker-compose down -v --remove-orphans

check: ## Check source code issues
	yarn lint

deps: ## Install dependencies
	yarn install

fmt: ## Format code
	yarn lint:fix

test: check ## Run tests
	yarn test

help: ## Show this help
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "    %-20s%s\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  %s\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)
