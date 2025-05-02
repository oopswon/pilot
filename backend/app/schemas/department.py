from pydantic import BaseModel
from typing import Optional, List  # noqa: F401


class DepartmentBase(BaseModel):
    name: str


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(DepartmentBase):
    pass


class Department(DepartmentBase):
    id: int

    class Config:
        from_attributes = True
