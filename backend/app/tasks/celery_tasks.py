from celery import Celery
from app.core.config import settings

# Celery配置 (Mock标记 - 需要在部署时配置真实的Redis)
celery_app = Celery(
    "flipbook_converter",
    broker=settings.REDIS_URL,  # TODO: 配置真实的Redis连接
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task
def process_file_task(task_id: str, file_path: str, file_type: str):
    """Celery任务：异步处理文件"""
    import asyncio
    from app.core.database import SessionLocal
    from app.services.task_service import TaskService
    from app.services.file_processor import FileProcessor
    
    db = SessionLocal()
    try:
        task_service = TaskService(db)
        file_processor = FileProcessor()
        
        # 更新状态
        task_service.update_task_status(task_id, "processing", 10)
        
        # 处理文件
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        pages = loop.run_until_complete(
            file_processor.process_file(task_id, file_path, file_type)
        )
        
        # 保存页面信息
        task_service.add_pages(task_id, pages)
        
        # 更新状态为完成
        task_service.update_task_status(task_id, "completed", 100)
        
        return {"status": "success", "pages": len(pages)}
        
    except Exception as e:
        task_service.update_task_status(task_id, "failed", 0, str(e))
        return {"status": "error", "message": str(e)}
    finally:
        db.close()