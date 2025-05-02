import pytest
from fastapi import status

def test_create_pipeline(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["pipeline_name"] == pipeline_data["pipeline_name"]
    assert data["description"] == pipeline_data["description"]
    assert data["status"] == pipeline_data["status"]
    assert data["owner_user_id"] == test_user.id
    assert "id" in data
    assert "created_at" in data

def test_get_pipelines(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)
    
    response = client.get("/api/v1/pipelines/", headers=token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["pipeline_name"] == pipeline_data["pipeline_name"]

def test_get_pipeline_by_id(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    create_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)
    pipeline_id = create_response.json()["id"]
    
    response = client.get(f"/api/v1/pipelines/{pipeline_id}", headers=token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == pipeline_id
    assert data["pipeline_name"] == pipeline_data["pipeline_name"]

def test_get_nonexistent_pipeline(client, token_headers):
    response = client.get("/api/v1/pipelines/9999", headers=token_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_update_pipeline(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    create_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)
    pipeline_id = create_response.json()["id"]
    
    update_data = {
        "pipeline_name": "Updated Pipeline",
        "status": "In Progress"
    }
    response = client.put(f"/api/v1/pipelines/{pipeline_id}", json=update_data, headers=token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["pipeline_name"] == update_data["pipeline_name"]
    assert data["status"] == update_data["status"]
    assert data["description"] == pipeline_data["description"]  # Unchanged

def test_delete_pipeline(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    create_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)
    pipeline_id = create_response.json()["id"]
    
    response = client.delete(f"/api/v1/pipelines/{pipeline_id}", headers=token_headers)
    assert response.status_code == status.HTTP_200_OK
    
    get_response = client.get(f"/api/v1/pipelines/{pipeline_id}", headers=token_headers)
    assert get_response.status_code == status.HTTP_404_NOT_FOUND
