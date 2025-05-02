from sqlalchemy.orm import Session
from .base import engine, Base


def init_db():
    Base.metadata.create_all(bind=engine)
