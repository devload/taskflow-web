const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(email, password, name) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export function getTasks(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/tasks${query ? `?${query}` : ''}`);
}

export function getTask(id) {
  return request(`/tasks/${id}`);
}

export function createTask(data) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTask(id, data) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
