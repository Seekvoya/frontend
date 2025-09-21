import request from './api'; // Импортируем наш универсальный клиент

/**
 * Получает список всех банков.
 * @returns {Promise<Array>}
 */
const getBanks = () => {
    return request('/banks');
};

/**
 * Создает новый банк.
 * @param {object} bankData - Данные для нового банка (например, { name: 'My Bank', balance: 1000 }).
 * @returns {Promise<object>}
 */
const createBank = (bankData) => {
    return request('/banks', {
        method: 'POST',
        body: JSON.stringify(bankData),
    });
};

export default {
    getBanks,
    createBank,
};