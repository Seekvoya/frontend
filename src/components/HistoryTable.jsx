import React from 'react';

const HistoryTable = () => {
  const historyData = [
  ];

  return (
    <section className="history-table">
      <div className="table-header">
        <h2>История</h2>
        <button className="refresh-button">
          <span>Обновить</span>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Тип</th>
            <th>Сумма (USDT)</th>
            <th>Баланс (USDT)</th>
            <th>Заморожено (USDT)</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>
                <span>{item.date}</span>
                <br />
                <span>{item.type}</span>
              </td>
              <td>{item.amount}</td>
              <td>{item.balance}</td>
              <td>{item.frozen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default HistoryTable;