import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from ..database.base import Base, get_db
from ..main import app
from ..models.department import Department
from ..models.user import User
from ..core.security import get_password_hash

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c
    
    app.dependency_overrides = {}

@pytest.fixture(scope="function")
def test_department(db):
    department = Department(name="Test Department")
    db.add(department)
    db.commit()
    db.refresh(department)
    return department

@pytest.fixture(scope="function")
def test_user(db, test_department):
    user = User(
        username="testuser",
        password_hash=get_password_hash("password123"),
        department_id=test_department.id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="function")
def test_admin(db, test_department):
    admin = User(
        username="admin",
        password_hash=get_password_hash("admin123"),
        department_id=test_department.id
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

@pytest.fixture(scope="function")
def token_headers(client, test_user):
    login_data = {
        "username": test_user.username,
        "password": "password123"
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="function")
def admin_token_headers(client, test_admin):
    login_data = {
        "username": test_admin.username,
        "password": "admin123"
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
