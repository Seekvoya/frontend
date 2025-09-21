import React from 'react';
import PageLayout from '../components/PageLayout';

const SmsPage = ({ user, userData, onLogout }) => {
  // В скриншоте показано пустое состояние — делаю аналогичное
  return (
    <PageLayout activeTab="sms" onLogout={onLogout} user={user} balance={userData?.balance}>
        <section className="balance-section">
        <h2>Сообщения</h2>
        </section>

      <div className="balance-section">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Кому</th>
                <th>Текст</th>
                <th>Дата</th>
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

export default SmsPage;
