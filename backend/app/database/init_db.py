from sqlalchemy.orm import Session
from ..models import Base
from .base import engine


def init_db():
    Base.metadata.create_all(bind=engine)
