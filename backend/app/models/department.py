from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..database.base import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)

    users = relationship("User", back_populates="department")
    pipelines = relationship("Pipeline", back_populates="department")
