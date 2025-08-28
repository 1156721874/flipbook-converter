FROM python:3.11-slim

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    wkhtmltopdf \
    poppler-utils \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制requirements文件
COPY requirements.txt .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY ./app /app/app

# 创建必要的目录
RUN mkdir -p /app/static /app/uploads

# 设置环境变量
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# .env.example
# 应用配置
DEBUG=true
SECRET_KEY=your-secret-key-change-in-production

# 数据库配置
DATABASE_URL=sqlite:///./flipbook.db

# Cloudflare R2配置 (需要替换为真实值)
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=flipbook-storage
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-cdn.example.com

# Redis配置
REDIS_URL=redis://localhost:6379

# 文件处理配置
MAX_FILE_SIZE=524288000  # 500MB
PDF_DPI=200
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
IMAGE_QUALITY=85