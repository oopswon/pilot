from fastapi import APIRouter

from ..auth.router import router as auth_router
from ..pipeline.router import router as pipeline_router
from ..event.router import router as event_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(pipeline_router, prefix="/pipelines", tags=["pipelines"])
api_router.include_router(event_router, prefix="/events", tags=["events"])
