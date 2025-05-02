from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database.base import get_db
from ..models.user import User
from ..api.deps import get_current_user
from ..schemas.pipeline import Pipeline, PipelineCreate, PipelineUpdate
from . import service

router = APIRouter()

@router.get("/", response_model=List[Pipeline])
def read_pipelines(
    skip: int = 0, 
    limit: int = 100,
    owner_id: Optional[int] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pipelines = service.get_pipelines(
        db, skip=skip, limit=limit, 
        owner_id=owner_id, department_id=department_id
    )
    return pipelines

@router.post("/", response_model=Pipeline)
def create_pipeline(
    pipeline_in: PipelineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.create_pipeline(db, pipeline_in, current_user.id)

@router.get("/{pipeline_id}", response_model=Pipeline)
def read_pipeline(
    pipeline_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pipeline = service.get_pipeline(db, pipeline_id)
    if pipeline is None:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return pipeline

@router.put("/{pipeline_id}", response_model=Pipeline)
def update_pipeline(
    pipeline_id: int,
    pipeline_in: PipelineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pipeline = service.get_pipeline(db, pipeline_id)
    if pipeline is None:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    if pipeline.owner_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return service.update_pipeline(db, pipeline_id, pipeline_in)

@router.delete("/{pipeline_id}", response_model=Pipeline)
def delete_pipeline(
    pipeline_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pipeline = service.get_pipeline(db, pipeline_id)
    if pipeline is None:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    if pipeline.owner_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return service.delete_pipeline(db, pipeline_id)
