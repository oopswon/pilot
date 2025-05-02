import pytest
from fastapi import status

def test_register_user(client, db):
    user_data = {
        "username": "newuser",
        "password": "newpassword123",
        "department_id": None
    }
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["username"] == user_data["username"]
    assert "id" in data
    assert "password_hash" not in data

def test_register_duplicate_username(client, test_user):
    user_data = {
        "username": test_user.username,  # Already exists
        "password": "newpassword123",
        "department_id": None
    }
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_login_success(client, test_user):
    login_data = {
        "username": test_user.username,
        "password": "password123"
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client, test_user):
    login_data = {
        "username": test_user.username,
        "password": "wrongpassword"
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_login_nonexistent_user(client):
    login_data = {
        "username": "nonexistentuser",
        "password": "password123"
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_protected_route_with_token(client, token_headers):
    response = client.get("/api/v1/pipelines/", headers=token_headers)
    assert response.status_code == status.HTTP_200_OK

def test_protected_route_without_token(client):
    response = client.get("/api/v1/pipelines/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
