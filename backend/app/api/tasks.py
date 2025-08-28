from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.services.task_service import TaskService
from app.schemas.task import TaskStatus

router = APIRouter()

@router.get("/task/{task_id}/status", response_model=TaskStatus)
async def get_task_status(task_id: str, db: Session = Depends(get_db)):
    """获取任务状态"""
    task_service = TaskService(db)
    status = task_service.get_task_status(task_id)
    
    if not status:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return status

@router.get("/tasks", response_model=List[TaskStatus])
async def get_user_tasks(db: Session = Depends(get_db)):
    """获取用户任务列表（简化实现，实际需要用户认证）"""
    # 这里应该根据用户ID获取任务
    # 简化实现：返回最近的10个任务
    tasks = db.query(Task).order_by(Task.created_at.desc()).limit(10).all()
    
    task_service = TaskService(db)
    return [task_service.get_task_status(task.id) for task in tasks if task_service.get_task_status(task.id)]
