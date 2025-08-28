.PHONY: help build deploy clean logs

help:
	@echo "Available commands:"
	@echo "  build     - Build Docker images"
	@echo "  deploy    - Deploy with Docker Compose"
	@echo "  k8s       - Deploy to Kubernetes"
	@echo "  clean     - Clean up containers and images"
	@echo "  logs      - View logs"
	@echo "  test      - Run tests"

build:
	@echo "Building Docker images..."
	docker build -t flipbook-frontend ./frontend
	docker build -t flipbook-backend ./backend

deploy:
	@echo "Deploying with Docker Compose..."
	./deploy.sh

k8s:
	@echo "Deploying to Kubernetes..."
	kubectl apply -f kubernetes/

clean:
	@echo "Cleaning up..."
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f

logs:
	@echo "Viewing logs..."
	docker-compose -f docker-compose.prod.yml logs -f

test:
	@echo "Running tests..."
	cd frontend && npm test
	cd backend && python -m pytest

dev:
	@echo "Starting development environment..."
	docker-compose up -d

stop:
	@echo "Stopping services..."
	docker-compose -f docker-compose.prod.yml down

restart:
	@echo "Restarting services..."
	docker-compose -f docker-compose.prod.yml restart

backup:
	@echo "Creating backup..."
	tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz data/