/**
 * Универсальная функция для выполнения запросов к API.
 * Автоматически добавляет токен авторизации.
 * @param {string} endpoint - Путь к эндпоинту (например, '/banks').
 * @param {object} options - Опции для fetch (method, headers, body).
 * @returns {Promise<any>}
 */
const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Ошибка при выполнении запроса');
    }
    return data;
};

export default request;