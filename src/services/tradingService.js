import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'localhost:3001';

// Добавляем токен к каждому запросу
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const TradingService = {
  async getTradingPairs() {
    const response = await axios.get(`${API_URL}/trading/pairs`);
    return response.data;
  },

  async createOrder(orderData) {
    const response = await axios.post(`${API_URL}/trading/orders`, orderData);
    return response.data;
  },

  async getUserOrders() {
    const response = await axios.get(`${API_URL}/trading/orders`);
    return response.data;
  },

  async getUserPortfolio() {
    const response = await axios.get(`${API_URL}/trading/portfolio`);
    return response.data;
  },

  async cancelOrder(orderId) {
    const response = await axios.delete(`${API_URL}/trading/orders/${orderId}`);
    return response.data;
  }
};
