#!/bin/bash

echo "Starting Flipbook Converter deployment..."

# 检查必要的环境变量
required_vars=(
    "R2_ACCESS_KEY_ID"
    "R2_SECRET_ACCESS_KEY" 
    "R2_BUCKET_NAME"
    "R2_ENDPOINT_URL"
    "R2_PUBLIC_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Environment variable $var is not set"
        echo "Please set all required Cloudflare R2 configuration variables"
        exit 1
    fi
done

# 创建必要的目录
mkdir -p data ssl logs

# 构建和启动服务
echo "Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# 等待服务启动
echo "Waiting for services to start..."
sleep 30

# 检查服务状态
echo "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# 检查后端健康状态
echo "Checking backend health..."
curl -f http://localhost:8000/health || {
    echo "Backend health check failed"
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
}

# 检查前端
echo "Checking frontend..."
curl -f http://localhost:3000 || {
    echo "Frontend check failed"
    docker-compose -f docker-compose.prod.yml logs frontend
    exit 1
}

echo "Deployment completed successfully!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo ""
echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "To stop: docker-compose -f docker-compose.prod.yml down"