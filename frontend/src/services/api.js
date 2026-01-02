import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request/response logging
apiClient.interceptors.request.use((config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', error.message, error.response?.data);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    register: (username, email, password) =>
        apiClient.post('/auth/register', { username, email, password }),
    login: (email, password) =>
        apiClient.post('/auth/login', { email, password })
};

// User endpoints
export const userAPI = {
    getProfile: () => apiClient.get('/users/me'),
    getAllUsers: () => apiClient.get('/users')
};

// Task endpoints
export const taskAPI = {
    getTasks: (status, priority) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        return apiClient.get(`/tasks?${params.toString()}`);
    },
    getTaskById: (id) => apiClient.get(`/tasks/${id}`),
    createTask: (title, description, priority) =>
        apiClient.post('/tasks', { title, description, priority }),
    updateTask: (id, updates) =>
        apiClient.put(`/tasks/${id}`, updates),
    deleteTask: (id) =>
        apiClient.delete(`/tasks/${id}`)
};

export default apiClient;
