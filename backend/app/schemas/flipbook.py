from pydantic import BaseModel
from typing import List
from datetime import datetime

class FlipbookPage(BaseModel):
    page: int
    url: str
    thumbnailUrl: Optional[str] = None

class FlipbookResponse(BaseModel):
    taskId: str
    title: str
    totalPages: int
    pages: List[FlipbookPage]
    createdAt: str