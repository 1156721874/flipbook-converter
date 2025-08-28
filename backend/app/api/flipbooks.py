from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.task_service import TaskService
from app.schemas.flipbook import FlipbookResponse

router = APIRouter()

@router.get("/flipbook/{task_id}", response_model=FlipbookResponse)
async def get_flipbook(task_id: str, db: Session = Depends(get_db)):
    """获取Flipbook数据"""
    task_service = TaskService(db)
    flipbook_data = task_service.get_flipbook_data(task_id)
    
    if not flipbook_data:
        raise HTTPException(status_code=404, detail="Flipbook not found or not ready")
    
    return flipbook_data