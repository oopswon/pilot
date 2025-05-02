from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Optional

from ..models.pipeline_event import PipelineEvent
from ..schemas.pipeline_event import PipelineEventCreate, PipelineEventUpdate

def get_event(db: Session, event_id: int):
    return db.query(PipelineEvent).filter(PipelineEvent.id == event_id).first()

def get_events(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    pipeline_id: Optional[int] = None
):
    query = db.query(PipelineEvent)
    
    if pipeline_id:
        query = query.filter(PipelineEvent.pipeline_id == pipeline_id)
    
    return query.offset(skip).limit(limit).all()

def create_event(db: Session, event_in: PipelineEventCreate):
    db_event = PipelineEvent(**event_in.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: int, event_in: PipelineEventUpdate):
    db_event = get_event(db, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_in.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_event, field, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = get_event(db, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(db_event)
    db.commit()
    return db_event
