const API_BASE = 'http://localhost:5000/api';

export const loginApi = async (email, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const getEmployeesApi = async (token) => {
  const res = await fetch(`${API_BASE}/employees`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error fetching employees');
  return data;
};

export const getShiftsApi = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/shifts?${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error fetching shifts');
  return data;
};

export const createShiftApi = async (token, body) => {
  const res = await fetch(`${API_BASE}/shifts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error creating shift');
  return data;
};

export const deleteShiftApi = async (token, id) => {
  const res = await fetch(`${API_BASE}/shift/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error deleting shift');
  return data;
};
