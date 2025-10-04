from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import uuid
import asyncio
from datetime import datetime
from typing import List, Optional
import logging

from app.core.config import settings
from app.core.database import get_db, engine
from app.models.database import Base
from app.api import tasks, flipbooks, uploads

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Flipbook Converter API",
    description="Convert documents to interactive flipbooks",
    version="1.0.0"
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件
app.mount("/static", StaticFiles(directory="static"), name="static")

# API路由
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(flipbooks.router, prefix="/api", tags=["flipbooks"])
app.include_router(uploads.router, prefix="/api", tags=["uploads"])

@app.get("/")
async def root():
    return {"message": "Flipbook Converter API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )