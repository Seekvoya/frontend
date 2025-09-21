import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardPage = ({ onLogout, user, userData, updateUserData }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Данные для dashboard
  const dailyStats = {
    received: 26,
    paid: 22,
    turnover: 1645
  };

  const monthlyStats = {
    received: 353,
    paid: 289,
    turnover: 22304
  };

  // Компонент Header
  // const Header = () => {
  //   return (
  //     <header className="header">
  //       <div className="logo">G.POINT</div>
  //       <div className="balance-info">
  //         <span>3258 USD</span>
  //       </div>
  //     </header>
  //   );
  // };

  return (
    <div className="dashboard-container">
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
          color: #e6edf3;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        // .header {
        //   display: flex;
        //   justify-content: space-between;
        //   align-items: center;
        //   padding: 20px 32px;
        //   background: rgba(255, 255, 255, 0.05);
        //   backdrop-filter: blur(10px);
        //   border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        //   position: sticky;
        //   top: 0;
        //   z-index: 100;
        // }

        .logo {
          font-size: 28px;
          font-weight: bold;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .balance-info {
          font-size: 20px;
          font-weight: 600;
          color: #22c55e;
        }

        .content {
        max-width: 1400px
          padding: 32px;
          width: 100%;
          box-sizing: border-box;
        }

        .balance-section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #f0f6fc;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title::before {
          content: '';
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-radius: 2px;
        }

        .balance-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .bank-card {
          position: relative;
          padding: 28px;
          border-radius: 16px;
          color: white;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        }

        .bank-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .bank-card.deposit {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        }

        .bank-card.profit {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        }

        .bank-card.stats {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        }

        .bank-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .bank-phone {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .bank-name {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          color: white;
        }

        .card-icon {
          font-size: 28px;
          opacity: 0.6;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .bank-details {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .bank-detail-item {
          padding: 8px 16px;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 500;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .bank-detail-item:hover {
          background-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
        }

        .stats-item {
          text-align: center;
        }

        .stats-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .stats-value {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .stats-value.success {
          color: #22c55e;
        }

        .banks-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .stats-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          padding: 28px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .stats-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        .stats-section h2 {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 600;
          color: #f0f6fc;
        }

        .stats-details {
          display: flex;
          justify-content: space-between;
          gap: 24px;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: white;
        }

        .stat-value.success {
          color: #22c55e;
        }

        .stat-value.info {
          color: #58a6ff;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .balance-details {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .content {
            padding: 20px;
          }

          .balance-details {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .banks-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .stats-grid {
            gap: 16px;
          }

          .stats-details {
            flex-direction: column;
            gap: 16px;
          }

          .bank-card {
            padding: 20px;
          }

          .bank-name {
            font-size: 28px;
          }

          .header {
            padding: 16px 20px;
          }

          .logo {
            font-size: 24px;
          }

          .balance-info {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .bank-details {
            justify-content: center;
          }
        }
      `}</style>

      <Header />
      <Sidebar />
      
      <div className="content">
        {/* Основные карточки с балансом */}
        <div className="balance-section">
          {/* <h2 className="section-title">Обзор баланса</h2>   */}
          <div className="balance-details">
            {/* Deposit Card */}
            <div className="bank-card deposit">
              <div className="bank-info">
                <div>
                  <div className="bank-phone">Ваш депозит</div>
                  <div className="bank-name">2000 USD</div>
                </div>
                {/* <span className="card-icon">💳</span> */}
              </div>
              <div className="bank-details">
                {/* <span className="bank-detail-item">📈 В профит</span> */}
                <span className="bank-detail-item">➕ Пополнить</span>
              </div>
            </div>

            {/* Profit Card */}
            <div className="bank-card profit">
              <div className="bank-info">
                <div>
                  <div className="bank-phone">Профит</div>
                  <div className="bank-name">1557.5 USD</div>
                </div>
                <span className="card-icon">💰</span>
              </div>
              <div className="bank-details">
                <span className="bank-detail-item">📊 На депозит</span>
                <span className="bank-detail-item">💳 Вывести</span>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bank-card stats">
              <div className="bank-info">
                <div className="stats-grid">
                  <div className="stats-item">
                    <div className="stats-label">Материал</div>
                    <div className="stats-value">28</div>
                  </div>
                  <div className="stats-item">
                    <div className="stats-label">В работе</div>
                    <div className="stats-value success">9</div>
                  </div>
                  <div className="stats-item">
                    <div className="stats-label">Устройства</div>
                    <div className="stats-value success">9 / 9</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="balance-section">
          <h2 className="section-title">Статистика заявок</h2>
          <div className="banks-container">
            {/* Daily Stats */}
            <div className="stats-section">
              <h2>За сутки</h2>
              <div className="stats-details">
                <div className="stat-item">
                  <span className="stat-label">Получено</span>
                  <span className="stat-value">{dailyStats.received}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Оплачено</span>
                  <span className="stat-value success">{dailyStats.paid}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Оборот</span>
                  <span className="stat-value info">{dailyStats.turnover}$</span>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="stats-section">
              <h2>За месяц</h2>
              <div className="stats-details">
                <div className="stat-item">
                  <span className="stat-label">Получено</span>
                  <span className="stat-value">{monthlyStats.received}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Оплачено</span>
                  <span className="stat-value success">{monthlyStats.paid}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Оборот</span>
                  <span className="stat-value info">{monthlyStats.turnover}$</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;