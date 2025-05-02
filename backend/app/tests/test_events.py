import pytest  # noqa: F401
from fastapi import status


def test_create_event(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    pipeline_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)  # noqa: E501
    pipeline_id = pipeline_response.json()["id"]

    event_data = {
        "pipeline_id": pipeline_id,
        "event_type": "phone_in",
        "note": "Test phone call"
    }
    response = client.post("/api/v1/events/", json=event_data, headers=token_headers)  # noqa: E501
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["pipeline_id"] == event_data["pipeline_id"]
    assert data["event_type"] == event_data["event_type"]
    assert data["note"] == event_data["note"]
    assert "id" in data
    assert "timestamp" in data


def test_get_events(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    pipeline_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)  # noqa: E501
    pipeline_id = pipeline_response.json()["id"]

    event_data = {
        "pipeline_id": pipeline_id,
        "event_type": "phone_in",
        "note": "Test phone call"
    }
    client.post("/api/v1/events/", json=event_data, headers=token_headers)

    response = client.get("/api/v1/events/", headers=token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["event_type"] == event_data["event_type"]
    assert data[0]["note"] == event_data["note"]


def test_get_events_by_pipeline(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    pipeline_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)  # noqa: E501
    pipeline_id = pipeline_response.json()["id"]

    event_data = {
        "pipeline_id": pipeline_id,
        "event_type": "phone_in",
        "note": "Test phone call"
    }
    client.post("/api/v1/events/", json=event_data, headers=token_headers)

    response = client.get(f"/api/v1/events/?pipeline_id={pipeline_id}", headers=token_headers)  # noqa: E501
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["pipeline_id"] == pipeline_id


def test_get_event_by_id(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    pipeline_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)  # noqa: E501
    pipeline_id = pipeline_response.json()["id"]

    event_data = {
        "pipeline_id": pipeline_id,
        "event_type": "phone_in",
        "note": "Test phone call"
    }
    event_response = client.post("/api/v1/events/", json=event_data, headers=token_headers)  # noqa: E501
    event_id = event_response.json()["id"]

    response = client.get(f"/api/v1/events/{event_id}", headers=token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == event_id
    assert data["pipeline_id"] == event_data["pipeline_id"]
    assert data["event_type"] == event_data["event_type"]


def test_update_event(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    pipeline_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)  # noqa: E501
    pipeline_id = pipeline_response.json()["id"]

    event_data = {
        "pipeline_id": pipeline_id,
        "event_type": "phone_in",
        "note": "Test phone call"
    }
    event_response = client.post("/api/v1/events/", json=event_data, headers=token_headers)  # noqa: E501
    event_id = event_response.json()["id"]

    update_data = {
        "event_type": "email_in",
        "note": "Updated note"
    }
    response = client.put(f"/api/v1/events/{event_id}", json=update_data, headers=token_headers)  # noqa: E501
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["event_type"] == update_data["event_type"]
    assert data["note"] == update_data["note"]
    assert data["pipeline_id"] == event_data["pipeline_id"]  # Unchanged


def test_delete_event(client, token_headers, test_user):
    pipeline_data = {
        "pipeline_name": "Test Pipeline",
        "description": "This is a test pipeline",
        "status": "New",
        "department_id": test_user.department_id
    }
    pipeline_response = client.post("/api/v1/pipelines/", json=pipeline_data, headers=token_headers)  # noqa: E501
    pipeline_id = pipeline_response.json()["id"]

    event_data = {
        "pipeline_id": pipeline_id,
        "event_type": "phone_in",
        "note": "Test phone call"
    }
    event_response = client.post("/api/v1/events/", json=event_data, headers=token_headers)  # noqa: E501
    event_id = event_response.json()["id"]

    response = client.delete(f"/api/v1/events/{event_id}", headers=token_headers)  # noqa: E501
    assert response.status_code == status.HTTP_200_OK

    get_response = client.get(f"/api/v1/events/{event_id}", headers=token_headers)  # noqa: E501
    assert get_response.status_code == status.HTTP_404_NOT_FOUND
