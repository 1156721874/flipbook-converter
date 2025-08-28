from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
import os
import tempfile
import aiofiles
from typing import List

from app.core.database import get_db
from app.core.config import settings
from app.services.storage_service import StorageService
from app.services.task_service import TaskService
from app.services.file_processor import FileProcessor
from app.schemas.task import TaskCreate
from app.tasks.celery_tasks import process_file_task

router = APIRouter()

@router.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """文件上传接口"""
    
    # 验证文件类型
    if not any(file.filename.lower().endswith(ext) for ext in settings.ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    # 验证文件大小
    if file.size and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    try:
        # 生成任务ID
        task_id = str(uuid.uuid4())
        
        # 保存文件到临时目录
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # 上传到R2存储
        storage_service = StorageService()
        file_key = f"uploads/{task_id}/{file.filename}"
        
        await storage_service.upload_file(tmp_file_path, file_key, file.content_type)
        
        # 创建任务记录
        task_service = TaskService(db)
        task_data = TaskCreate(
            id=task_id,
            original_name=file.filename,
            file_key=file_key,
            file_type=file.content_type,
            file_size=len(content)
        )
        
        task = task_service.create_task(task_data)
        
        # 添加后台处理任务
        background_tasks.add_task(process_file_background, task_id, tmp_file_path, file.content_type)
        
        # 清理临时文件
        os.unlink(tmp_file_path)
        
        return {
            "taskId": task_id,
            "status": "uploaded",
            "message": "File uploaded successfully, conversion started"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

async def process_file_background(task_id: str, file_path: str, file_type: str):
    """后台文件处理任务"""
    from app.core.database import SessionLocal
    
    db = SessionLocal()
    try:
        task_service = TaskService(db)
        file_processor = FileProcessor()
        
        # 更新状态为处理中
        task_service.update_task_status(task_id, "processing", 10)
        
        # 处理文件
        pages = await file_processor.process_file(task_id, file_path, file_type)
        
        # 保存页面信息
        task_service.add_pages(task_id, pages)
        
        # 更新状态为完成
        task_service.update_task_status(task_id, "completed", 100)
        
    except Exception as e:
        # 更新状态为失败
        task_service.update_task_status(task_id, "failed", 0, str(e))
    finally:
        db.close()