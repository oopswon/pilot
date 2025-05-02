from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from ..database.base import Base


class EventType(enum.Enum):
    phone_in = "phone_in"
    phone_out = "phone_out"
    email_in = "email_in"
    email_out = "email_out"
    meeting_in = "meeting_in"
    meeting_out = "meeting_out"
    status_change = "status_change"


class PipelineEvent(Base):
    __tablename__ = "pipeline_events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pipeline_id = Column(Integer, ForeignKey("pipelines.id"))
    event_type = Column(Enum(EventType), nullable=False)
    note = Column(Text)
    timestamp = Column(DateTime, default=func.now())

    pipeline = relationship("Pipeline", back_populates="events")
