from pydantic import BaseModel
from typing import Optional  # noqa: F401
from datetime import datetime
from ..models.pipeline_event import EventType


class PipelineEventBase(BaseModel):
    event_type: EventType
    note: Optional[str] = None


class PipelineEventCreate(PipelineEventBase):
    pipeline_id: int


class PipelineEventUpdate(PipelineEventBase):
    pass


class PipelineEvent(PipelineEventBase):
    id: int
    pipeline_id: int
    timestamp: datetime

    class Config:
        from_attributes = True
