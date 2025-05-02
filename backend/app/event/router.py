from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional  # noqa: F401

from ..database.base import get_db
from ..models.user import User
from ..api.deps import get_current_user
from ..schemas.pipeline_event import PipelineEvent, PipelineEventCreate, PipelineEventUpdate
from . import service
from ..pipeline.service import get_pipeline

router = APIRouter()

@router.get("/", response_model=List[PipelineEvent])
def read_events(
    skip: int = 0,
    limit: int = 100,
    pipeline_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    events = service.get_events(
        db, skip=skip, limit=limit, pipeline_id=pipeline_id
    )
    return events

@router.post("/", response_model=PipelineEvent)
def create_event(
    event_in: PipelineEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pipeline = get_pipeline(db, event_in.pipeline_id)
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    return service.create_event(db, event_in)

@router.get("/{event_id}", response_model=PipelineEvent)
def read_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = service.get_event(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=PipelineEvent)
def update_event(
    event_id: int,
    event_in: PipelineEventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = service.get_event(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    pipeline = get_pipeline(db, event.pipeline_id)
    if not pipeline or pipeline.owner_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return service.update_event(db, event_id, event_in)

@router.delete("/{event_id}", response_model=PipelineEvent)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = service.get_event(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    pipeline = get_pipeline(db, event.pipeline_id)
    if not pipeline or pipeline.owner_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return service.delete_event(db, event_id)
