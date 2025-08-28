from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True)
    original_name = Column(String, nullable=False)
    file_key = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, default=0)
    status = Column(String, default="uploaded")  # uploaded, processing, completed, failed
    progress = Column(Integer, default=0)
    total_pages = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    error_message = Column(Text)
    
    pages = relationship("Page", back_populates="task", cascade="all, delete-orphan")

class Page(Base):
    __tablename__ = "pages"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    image_url = Column(String, nullable=False)
    thumbnail_url = Column(String)
    width = Column(Integer)
    height = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    task = relationship("Task", back_populates="pages")