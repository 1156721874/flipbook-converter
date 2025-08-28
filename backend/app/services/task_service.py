from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.models.database import Task, Page
from app.schemas.task import TaskCreate, TaskResponse, TaskStatus
from app.schemas.flipbook import FlipbookResponse, FlipbookPage

class TaskService:
    def __init__(self, db: Session):
        self.db = db

    def create_task(self, task_data: TaskCreate) -> Task:
        """创建新任务"""
        task = Task(
            id=task_data.id,
            original_name=task_data.original_name,
            file_key=task_data.file_key,
            file_type=task_data.file_type,
            file_size=task_data.file_size,
            status="uploaded"
        )
        
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def get_task(self, task_id: str) -> Optional[Task]:
        """获取任务"""
        return self.db.query(Task).filter(Task.id == task_id).first()

    def update_task_status(self, task_id: str, status: str, progress: int = 0, error_message: str = None):
        """更新任务状态"""
        task = self.get_task(task_id)
        if task:
            task.status = status
            task.progress = progress
            task.updated_at = datetime.utcnow()
            
            if error_message:
                task.error_message = error_message
            
            if status == "completed":
                task.completed_at = datetime.utcnow()
                task.progress = 100
            
            self.db.commit()
            return task
        return None

    def add_pages(self, task_id: str, pages_data: List[tuple]):
        """添加页面数据"""
        task = self.get_task(task_id)
        if not task:
            return False
        
        for page_num, page_url in pages_data:
            page = Page(
                task_id=task_id,
                page_number=page_num,
                image_url=page_url
            )
            self.db.add(page)
        
        # 更新任务的总页数
        task.total_pages = len(pages_data)
        
        self.db.commit()
        return True

    def get_task_status(self, task_id: str) -> Optional[TaskStatus]:
        """获取任务状态"""
        task = self.get_task(task_id)
        if not task:
            return None
        
        flipbook_url = None
        if task.status == "completed":
            flipbook_url = f"/flipbook/{task_id}"
        
        return TaskStatus(
            taskId=task.id,
            status=task.status,
            progress=task.progress,
            flipbookUrl=flipbook_url,
            error=task.error_message
        )

    def get_flipbook_data(self, task_id: str) -> Optional[FlipbookResponse]:
        """获取Flipbook数据"""
        task = self.db.query(Task).filter(
            Task.id == task_id, 
            Task.status == "completed"
        ).first()
        
        if not task:
            return None
        
        pages = self.db.query(Page).filter(
            Page.task_id == task_id
        ).order_by(Page.page_number).all()
        
        flipbook_pages = [
            FlipbookPage(
                page=page.page_number,
                url=page.image_url,
                thumbnailUrl=page.thumbnail_url
            ) for page in pages
        ]
        
        return FlipbookResponse(
            taskId=task.id,
            title=task.original_name,
            totalPages=task.total_pages,
            pages=flipbook_pages,
            createdAt=task.created_at.isoformat()
        )