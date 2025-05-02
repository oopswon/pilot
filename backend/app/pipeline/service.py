from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Optional

from ..models.pipeline import Pipeline
from ..schemas.pipeline import PipelineCreate, PipelineUpdate

def get_pipeline(db: Session, pipeline_id: int):
    return db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()

def get_pipelines(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    owner_id: Optional[int] = None,
    department_id: Optional[int] = None
):
    query = db.query(Pipeline)
    
    if owner_id:
        query = query.filter(Pipeline.owner_user_id == owner_id)
    
    if department_id:
        query = query.filter(Pipeline.department_id == department_id)
    
    return query.offset(skip).limit(limit).all()

def create_pipeline(db: Session, pipeline_in: PipelineCreate, owner_id: int):
    db_pipeline = Pipeline(
        **pipeline_in.dict(),
        owner_user_id=owner_id
    )
    db.add(db_pipeline)
    db.commit()
    db.refresh(db_pipeline)
    return db_pipeline

def update_pipeline(db: Session, pipeline_id: int, pipeline_in: PipelineUpdate):
    db_pipeline = get_pipeline(db, pipeline_id)
    if not db_pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    update_data = pipeline_in.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_pipeline, field, value)
    
    db.commit()
    db.refresh(db_pipeline)
    return db_pipeline

def delete_pipeline(db: Session, pipeline_id: int):
    db_pipeline = get_pipeline(db, pipeline_id)
    if not db_pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    db.delete(db_pipeline)
    db.commit()
    return db_pipeline
