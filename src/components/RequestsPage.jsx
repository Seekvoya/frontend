import React, { useState } from 'react';
import PageLayout from './PageLayout';

const RequestsPage = ({ user, userData, onLogout, updateUserData }) => {
  const [filters, setFilters] = useState({
    id: '',
    shortId: '',
    requisit: '',
    status: 'All',
    min: '',
    max: '',
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59'
  });

  const handleChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setFilters({
      id: '',
      shortId: '',
      requisit: '',
      status: 'All',
      min: '',
      max: '',
      startDate: '',
      startTime: '00:00',
      endDate: '',
      endTime: '23:59'
    });
  };

  const handleSearch = () => {
    console.log('Ищем с фильтрами', filters);
  };

  const handleCsv = () => {
    const csv = 'ID,Short ID,Реквизит,Статус,Сумма,Дата\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    console.log('Обновляем данные');
  };

  return (
    <PageLayout activeTab="requests" onLogout={onLogout} user={user} balance={userData?.balance}>
      {/* Вставляем стили прямо на страницу */}
      <style>{`
        /* --- Общие секции --- */
        .balance-section {
          background: #fff;
          padding: 20px 24px;
          margin-bottom: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .balance-section h2 { margin: 0 0 12px 0; font-size: 22px; font-weight: 600; }

        /* --- Фильтры --- */
        .filters-panel { display: flex; flex-direction: column; gap: 16px; }
        .filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
        .form-input {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #4f8ef7; outline: none; }
        .date-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .date-field { display: flex; flex-direction: column; }
        .small-label { font-size: 12px; color: #555; margin-bottom: 4px; }
        .date-controls { display: flex; gap: 8px; }

        /* --- Кнопки --- */
        .filter-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .top-up-button.gradient-btn {
          background: linear-gradient(135deg, #4f8ef7, #28a745);
          color: #fff;
          padding: 8px 16px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: transform 0.1s, box-shadow 0.2s;
        }
        .top-up-button.gradient-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .btn-ghost {
          padding: 8px 16px;
          border: 1px solid #ccc;
          background: transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-ghost:hover { background: #f5f5f5; }

        /* --- Таблица истории --- */
        .history-table {
          background: #fff;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 500;
        }
        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 12px 8px; text-align: left; border-bottom: 1px solid #eee; }
        thead th { background: #f9f9f9; font-weight: 600; }
        tr:hover { background: #f5f8ff; transition: background 0.2s; }

        /* --- Пустое состояние --- */
        .empty-state { display: flex; flex-direction: column; align-items: center; color: #777; }
        .empty-icon { font-size: 32px; margin-bottom: 8px; }

        /* --- Кнопки CSV и Refresh --- */
        .csv-btn, .refresh-button {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          background: #f8f8f8;
          cursor: pointer;
          transition: 0.2s;
        }
        .csv-btn:hover, .refresh-button:hover { background: #eaeaea; }

        /* --- Статусы --- */
        .status-completed { color: #28a745; font-weight: 500; }
        .status-pending { color: #ffc107; font-weight: 500; }
        .status-frozen { color: #6c757d; font-weight: 500; }
        .status-cancelled { color: #dc3545; font-weight: 500; }
      `}</style>

      <section className="balance-section">
        <h2>Заявки</h2>
      </section>

      {/* Фильтры и таблица здесь */}
      <div className="balance-section filters-panel">
        <div className="filter-grid">
          <input className="form-input" name="id" placeholder="ID" value={filters.id} onChange={handleChange} />
          <input className="form-input" name="shortId" placeholder="Short ID" value={filters.shortId} onChange={handleChange} />
          <input className="form-input" name="requisit" placeholder="Реквизит" value={filters.requisit} onChange={handleChange} />
          <select className="form-input" name="status" value={filters.status} onChange={handleChange}>
            <option value="All">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="frozen">Frozen</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input className="form-input" name="min" placeholder="Мин" value={filters.min} onChange={handleChange} />
          <input className="form-input" name="max" placeholder="Макс" value={filters.max} onChange={handleChange} />
        </div>

        <div className="date-row">
          <div className="date-field">
            <label className="small-label">Начальная дата</label>
            <div className="date-controls">
              <input className="date-input" type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
              <input className="date-input" type="time" name="startTime" value={filters.startTime} onChange={handleChange} />
            </div>
          </div>
          <div className="date-field">
            <label className="small-label">Конечная дата</label>
            <div className="date-controls">
              <input className="date-input" type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
              <input className="date-input" type="time" name="endTime" value={filters.endTime} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="top-up-button gradient-btn" onClick={handleSearch}>🔍 Поиск</button>
          <button className="btn-ghost" onClick={handleReset}>Сбросить</button>
        </div>
      </div>

      <div className="history-table">
        <div className="table-header">
          <div>Найдено: 0</div>
          <div style={{display: 'flex', gap: 12}}>
            <button className="csv-btn" onClick={handleCsv}>CSV</button>
            <button className="refresh-button" onClick={handleRefresh}>Обновить</button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID / Short ID</th>
                <th>Дата открытия</th>
                <th>Реквизит</th>
                <th>Сумма</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" style={{padding: 40, textAlign: 'center'}}>
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div>Нет данных</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
};

export default RequestsPage;
