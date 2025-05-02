from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database.base import Base

class Pipeline(Base):
    __tablename__ = "pipelines"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pipeline_name = Column(String(255), nullable=False)
    description = Column(Text)
    owner_user_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    status = Column(String(100))
    created_at = Column(DateTime, default=func.now())

    owner = relationship("User", back_populates="pipelines")
    department = relationship("Department", back_populates="pipelines")
    events = relationship("PipelineEvent", back_populates="pipeline")
