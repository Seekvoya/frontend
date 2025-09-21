import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';

const HistoryPage = ({ user, userData, onLogout }) => {
  const [tab, setTab] = useState('unlinked');

  const renderTableEmpty = () => (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Связать</th>
            <th>Телефон</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="3" style={{padding: 40, textAlign: 'center'}}>
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div>Нет данных</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <PageLayout activeTab="history" onLogout={onLogout} user={user} balance={userData?.balance}>
        <section className="balance-section">
        <h2>История заявок</h2>
        </section>

      <div className="balance-section">
        <div className="tabs">
          <button className={`tab ${tab === 'unlinked' ? 'active' : ''}`} onClick={() => setTab('unlinked')}>Не связанные</button>
          <button className={`tab ${tab === 'linked' ? 'active' : ''}`} onClick={() => setTab('linked')}>Связанные</button>
          <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>Все</button>
        </div>

        <div style={{marginTop: 18}}>
          {renderTableEmpty()}
        </div>
      </div>
    </PageLayout>
  );
};

export default HistoryPage;
