.PHONY: help db-up db-down db-logs setup db-migrate db-seed db-studio db-reset dev build

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

setup: ## Run initial local setup (database + app)
	./setup-local.sh

db-up: ## Start PostgreSQL database
	docker compose up -d postgres

db-down: ## Stop PostgreSQL database
	docker compose down

db-logs: ## View database logs
	docker compose logs -f postgres

db-migrate: ## Run database migrations
	npx prisma migrate dev

db-push: ## Push database schema changes
	npx prisma db push

db-seed: ## Seed the database
	npx prisma generate && npm run db:seed

db-studio: ## Open Prisma Studio
	npx prisma studio

db-reset: ## Reset database (⚠️ deletes all data)
	docker compose down -v
	docker compose up -d postgres
	sleep 5
	npx prisma generate
	npx prisma db push --accept-data-loss
	npx prisma db seed

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm start
