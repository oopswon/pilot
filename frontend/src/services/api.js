import { getAuthHeaders } from '../utils/auth.js';

const API_URL = 'http://localhost:8000/api/v1';

export async function login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
}

export async function register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    return response.json();
}

export async function getPipelines(filters = {}) {
    let url = `${API_URL}/pipelines/`;
    const params = new URLSearchParams();
    
    if (filters.owner_id) params.append('owner_id', filters.owner_id);
    if (filters.department_id) params.append('department_id', filters.department_id);
    if (filters.skip) params.append('skip', filters.skip);
    if (filters.limit) params.append('limit', filters.limit);
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch pipelines');
    }

    return response.json();
}

export async function getPipeline(id) {
    const response = await fetch(`${API_URL}/pipelines/${id}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch pipeline');
    }

    return response.json();
}

export async function createPipeline(pipelineData) {
    const response = await fetch(`${API_URL}/pipelines/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pipelineData)
    });

    if (!response.ok) {
        throw new Error('Failed to create pipeline');
    }

    return response.json();
}

export async function updatePipeline(id, pipelineData) {
    const response = await fetch(`${API_URL}/pipelines/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(pipelineData)
    });

    if (!response.ok) {
        throw new Error('Failed to update pipeline');
    }

    return response.json();
}

export async function deletePipeline(id) {
    const response = await fetch(`${API_URL}/pipelines/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to delete pipeline');
    }

    return response.json();
}

export async function getEvents(filters = {}) {
    let url = `${API_URL}/events/`;
    const params = new URLSearchParams();
    
    if (filters.pipeline_id) params.append('pipeline_id', filters.pipeline_id);
    if (filters.skip) params.append('skip', filters.skip);
    if (filters.limit) params.append('limit', filters.limit);
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }

    return response.json();
}

export async function createEvent(eventData) {
    const response = await fetch(`${API_URL}/events/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        throw new Error('Failed to create event');
    }

    return response.json();
}

export async function updateEvent(id, eventData) {
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        throw new Error('Failed to update event');
    }

    return response.json();
}

export async function deleteEvent(id) {
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to delete event');
    }

    return response.json();
}
