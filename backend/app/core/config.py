from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # 应用配置
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # 数据库配置
    DATABASE_URL: str = "sqlite:///./flipbook.db"
    
    # Cloudflare R2配置 (Mock标记 - 需要在部署时配置)
    R2_ACCESS_KEY_ID: str = "MOCK_R2_ACCESS_KEY"  # TODO: 配置真实的R2访问密钥
    R2_SECRET_ACCESS_KEY: str = "MOCK_R2_SECRET_KEY"  # TODO: 配置真实的R2密钥
    R2_BUCKET_NAME: str = "flipbook-storage"
    R2_ENDPOINT_URL: str = "https://your-account-id.r2.cloudflarestorage.com"  # TODO: 替换为真实的R2端点
    R2_PUBLIC_URL: str = "https://your-cdn.example.com"  # TODO: 配置CDN域名
    
    # Redis配置 (Mock标记 - 需要在部署时配置)
    REDIS_URL: str = "redis://localhost:6379"  # TODO: 配置真实的Redis连接
    
    # 文件处理配置
    MAX_FILE_SIZE: int = 500 * 1024 * 1024  # 500MB
    ALLOWED_EXTENSIONS: list = [".pdf", ".ppt", ".pptx", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
    
    # 转换配置
    PDF_DPI: int = 200
    IMAGE_MAX_WIDTH: int = 1920
    IMAGE_MAX_HEIGHT: int = 1080
    IMAGE_QUALITY: int = 85
    
    class Config:
        env_file = ".env"

settings = Settings()