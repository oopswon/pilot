from pydantic import BaseModel
from typing import Optional  # noqa: F401
from datetime import datetime


class PipelineBase(BaseModel):
    pipeline_name: str
    description: Optional[str] = None
    department_id: Optional[int] = None
    status: Optional[str] = None


class PipelineCreate(PipelineBase):
    pass


class PipelineUpdate(PipelineBase):
    pipeline_name: Optional[str] = None


class Pipeline(PipelineBase):
    id: int
    owner_user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
