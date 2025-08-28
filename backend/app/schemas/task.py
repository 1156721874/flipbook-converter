from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    original_name: str
    file_type: str

class TaskCreate(TaskBase):
    file_key: str
    file_size: int

class TaskResponse(TaskBase):
    id: str
    status: str
    progress: int
    total_pages: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    flipbook_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class TaskStatus(BaseModel):
    taskId: str
    status: str
    progress: int
    flipbookUrl: Optional[str] = None
    error: Optional[str] = None