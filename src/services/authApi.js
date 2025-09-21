import axios from 'axios';

const API_BASE_URL = 'https://gpoint.pw:3001';

// Создаем экземпляр axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для получения токена из sessionStorage
const getAccessToken = () => {
  const user = sessionStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.access_token;
  }
  return null;
};

// Интерсептор для добавления токена к каждому запросу
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обработки ошибок аутентификации
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        const refreshResponse = await apiClient.post('/api/auth/refresh');
        const newToken = refreshResponse.data.access_token;

        // Обновляем токен в sessionStorage
        const user = JSON.parse(sessionStorage.getItem('user'));
        user.access_token = newToken;
        sessionStorage.setItem('user', JSON.stringify(user));

        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Если обновление токена не удалось, перенаправляем на логин
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API методы
export const authAPI = {
  login: (username, oneTimeCode) => 
    apiClient.post('/api/auth/login', { username, oneTimeCode }),
  
  refreshToken: () => 
    apiClient.post('/api/auth/refresh'),
  
  getProfile: () => 
    apiClient.get('/api/auth/profile'),
  
  checkUser: (username) => 
    apiClient.get(`/api/auth/check/${username}`),
  
  logout: () => 
    apiClient.post('/api/auth/logout'),

  generatePassword: (username) =>
    apiClient.post('/api/auth/generate-password', { username }),

  verifyPassword: (username, password) =>
    apiClient.post('/api/auth/verify-password', { username, password }),

  createUser: (username, password) =>
    apiClient.post('/api/auth/create-user', { username, password }),
};

export const banksAPI = {
  getAll: () => 
    apiClient.get('/api/banks'),
  
  getById: (id) => 
    apiClient.get(`/api/banks/${id}`),
  
  create: (bankData) => 
    apiClient.post('/api/banks', bankData),
  
  update: (id, bankData) => 
    apiClient.patch(`/api/banks/${id}`, bankData),
  
  delete: (id) => 
    apiClient.delete(`/api/banks/${id}`),
  
  toggleStatus: (id) => 
    apiClient.patch(`/api/banks/${id}/toggle-status`),
};

export default apiClient;