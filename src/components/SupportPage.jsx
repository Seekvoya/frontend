import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const SupportPage = ({ activeTab, user, onLogout }) => {
  const navigate = useNavigate();

  const handleTelegramClick = () => {
    window.open('https://t.me/overcards', '_blank');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#141E30] to-[#243B55] text-gray-100">
      <style>{`
        .support-container {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .support-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #7C4DFF, #00E676);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .faq-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          transition: background 0.3s, transform 0.2s;
        }
        .faq-card:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }
        .telegram-btn {
          background: linear-gradient(135deg, #0088cc, #00E676);
          color: white;
          font-weight: 500;
          padding: 12px 20px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .telegram-btn:hover {
          box-shadow: 0 4px 20px rgba(0, 200, 255, 0.4);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="flex-1 flex flex-col">
        <Header user={user?.username} balance={user?.balance} />
        <Sidebar activeTab="support" onLogout={onLogout} user={user?.username} />

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto p-8 support-container">
            <h1 className="support-title mb-6">Техническая поддержка</h1>

            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Свяжитесь с нами</h2>
              <p className="text-gray-300 mb-4">
                Если у вас возникли вопросы или проблемы, наша команда поддержки готова помочь вам.
              </p>
              <button onClick={handleTelegramClick} className="telegram-btn">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 
                  12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-
                  1.084.508l-3-2.21-1.446 1.394c-.14.1-.357.178-.55.178-.357 0-.457-
                  .3-.316-.634l1.55-4.93-2.97-1.03c-.643-.234-.658-.643.136-.953
                  l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Перейти в Telegram-чат поддержки
              </button>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Часто задаваемые вопросы</h2>
              <div className="space-y-4">
                <div className="faq-card p-4">
                  <h3 className="font-medium text-green-300">Как пополнить баланс?</h3>
                  <p className="text-gray-300 mt-2">
                    Перейдите в раздел "Баланс" и выберите подходящий способ пополнения.
                  </p>
                </div>
                <div className="faq-card p-4">
                  <h3 className="font-medium text-green-300">Что делать, если заявка зависла?</h3>
                  <p className="text-gray-300 mt-2">
                    Обратитесь в поддержку, указав номер заявки, и мы решим вопрос в кратчайшие сроки.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-gray-400 text-sm">
              <p>Обычное время ответа поддержки: в течение 15 минут в рабочее время (9:00–18:00 МСК).</p>
              <p className="mt-2">Электронная почта для экстренных случаев: <span className="text-gray-300">support@overcards.com</span></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupportPage;
