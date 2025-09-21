// utils/authApi.js
import axios from 'axios';

const API_BASE_URL = 'https://gpoint.pw:3001/api';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для получения токена из localStorage
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Функция для получения данных пользователя
export const getUserData = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

// Функция для очистки данных авторизации
export const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
};

// Функция для сохранения данных авторизации
export const saveAuthData = (token, userData) => {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user_data', JSON.stringify(userData));
};

// Интерсептор запросов - автоматически добавляем токен в заголовки
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор ответов - обрабатываем истечение токена
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Если получили 401, значит токен истек или невалиден
    if (error.response?.status === 401) {
      clearAuthData();
      // Перенаправляем на страницу логина только если мы не на ней
      if (window.location.pathname !== '/login' && window.location.pathname !== '/registration') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Основная функция для API запросов
export const apiRequest = apiClient;

// Специфичные методы для вашего API
export const authAPI = {
  // Авторизация (без токена)
  login: async (username, oneTimeCode) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      oneTimeCode
    });
    return response.data;
  },

  // Регистрация (без токена)
  register: async (username, oneTimeCode) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      oneTimeCode
    });
    return response.data;
  },

  // Получение профиля (защищенный маршрут)
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Проверка пользователя по username (может быть защищенным)
  getUserInfo: async (username) => {
    const response = await apiClient.get(`/auth/check/${username}`);
    return response.data;
  },

  // Генерация нового пароля (защищенный)
  generatePassword: async (username) => {
    const response = await apiClient.post('/auth/generate-password', {
      username
    });
    return response.data;
  },
};

// API для работы с банками
export const banksAPI = {
  // Получить все банки пользователя
  getAll: async () => {
    const response = await apiClient.get('/banks');
    return response.data;
  },

  // Получить статистику банков пользователя
  getStats: async () => {
    const response = await apiClient.get('/banks/stats');
    return response.data;
  },

  // Получить активные банки
  getActive: async () => {
    const response = await apiClient.get('/banks/active');
    return response.data;
  },

  // Получить неактивные банки
  getInactive: async () => {
    const response = await apiClient.get('/banks/inactive');
    return response.data;
  },

  // Получить конкретный банк
  getById: async (id) => {
    const response = await apiClient.get(`/banks/${id}`);
    return response.data;
  },

  // Создать новый банк
  create: async (bankData) => {
    const response = await apiClient.post('/banks', bankData);
    return response.data;
  },

  // Обновить банк
  update: async (id, bankData) => {
    const response = await apiClient.patch(`/banks/${id}`, bankData);
    return response.data;
  },

  // Переключить статус банка
  toggleStatus: async (id) => {
    const response = await apiClient.patch(`/banks/${id}/toggle-status`);
    return response.data;
  },

  // Удалить банк
  delete: async (id) => {
    await apiClient.delete(`/banks/${id}`);
  },
};

// Проверка валидности токена
export const validateToken = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await apiClient.get('/auth/profile');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Функция для автоматического обновления данных пользователя
export const refreshUserData = async () => {
  const userData = getUserData();
  if (!userData?.username) return null;

  try {
    const response = await authAPI.getUserInfo(userData.username);
    const updatedData = {
      ...userData,
      ...response
    };
    
    saveAuthData(getAuthToken(), updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return null;
  }
};

// Hook для работы с авторизацией (если используете в React компонентах)
export const useAuthAPI = () => {
  return {
    login: async (username, oneTimeCode) => {
      try {
        const data = await authAPI.login(username, oneTimeCode);
        const userData = {
          username,
          ...data.user
        };
        saveAuthData(data.access_token, userData);
        return { success: true, userData, token: data.access_token };
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Ошибка авторизации' 
        };
      }
    },

    register: async (username, oneTimeCode) => {
      try {
        const data = await authAPI.register(username, oneTimeCode);
        return { success: true, data };
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Ошибка регистрации' 
        };
      }
    },

    logout: () => {
      clearAuthData();
      window.location.href = '/login';
    },

    isAuthenticated: () => {
      const token = getAuthToken();
      const userData = getUserData();
      return !!(token && userData);
    },

    getCurrentUser: () => {
      return getUserData();
    },

    updateUserData: async () => {
      return await refreshUserData();
    }
  };
};

// Hook для работы с банками
export const useBanksAPI = () => {
  return {
    // Получить все банки
    getAllBanks: async () => {
      try {
        const banks = await banksAPI.getAll();
        return { success: true, data: banks, error: null };
      } catch (error) {
        return {
          success: false,
          data: [],
          error: error.response?.data?.message || 'Ошибка загрузки банков'
        };
      }
    },

    // Создать банк
    createBank: async (bankData) => {
      try {
        const bank = await banksAPI.create(bankData);
        return { success: true, data: bank, error: null };
      } catch (error) {
        return {
          success: false,
          data: null,
          error: error.response?.data?.message || 'Ошибка создания банка'
        };
      }
    },

    // Обновить банк
    updateBank: async (id, bankData) => {
      try {
        const bank = await banksAPI.update(id, bankData);
        return { success: true, data: bank, error: null };
      } catch (error) {
        return {
          success: false,
          data: null,
          error: error.response?.data?.message || 'Ошибка обновления банка'
        };
      }
    },

    // Переключить статус банка
    toggleBankStatus: async (id) => {
      try {
        const bank = await banksAPI.toggleStatus(id);
        return { success: true, data: bank, error: null };
      } catch (error) {
        return {
          success: false,
          data: null,
          error: error.response?.data?.message || 'Ошибка изменения статуса банка'
        };
      }
    },

    // Удалить банк
    deleteBank: async (id) => {
      try {
        await banksAPI.delete(id);
        return { success: true, error: null };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Ошибка удаления банка'
        };
      }
    },

    // Получить статистику банков
    getBanksStats: async () => {
      try {
        const stats = await banksAPI.getStats();
        return { success: true, data: stats, error: null };
      } catch (error) {
        return {
          success: false,
          data: { total: 0, active: 0, inactive: 0 },
          error: error.response?.data?.message || 'Ошибка загрузки статистики'
        };
      }
    }
  };
};

// Функция для выполнения запросов с автоматической обработкой ошибок
export const safeApiCall = async (apiCall, defaultValue = null) => {
  try {
    const result = await apiCall();
    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      success: false, 
      data: defaultValue, 
      error: error.response?.data?.message || error.message || 'Неизвестная ошибка'
    };
  }
};

// Экспорт настроенного axios клиента для использования в других компонентах
export default apiClient;