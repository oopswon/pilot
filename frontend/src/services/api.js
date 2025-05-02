// API service for interacting with the backend
const API_URL = 'http://localhost:8000/api/v1';

// Helper function to handle API responses
async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'An error occurred');
    }
    return response.json();
}

// Authentication API calls
export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
}

export async function loginUser(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });
    return handleResponse(response);
}

// Pipeline API calls
export async function getPipelines() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pipelines/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}

export async function getPipeline(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pipelines/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}

export async function createPipeline(pipelineData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pipelines/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pipelineData),
    });
    return handleResponse(response);
}

export async function updatePipeline(id, pipelineData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pipelines/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pipelineData),
    });
    return handleResponse(response);
}

export async function deletePipeline(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pipelines/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}

// Pipeline Event API calls
export async function getEvents(pipelineId = null) {
    const token = localStorage.getItem('token');
    let url = `${API_URL}/events/`;
    if (pipelineId) {
        url += `?pipeline_id=${pipelineId}`;
    }
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}

export async function createEvent(eventData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/events/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function updateEvent(id, eventData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function deleteEvent(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}
