import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BalanceSection = ({ balance, updateBalance }) => {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentConfirmation = async () => {
    setIsProcessing(true);
    setShowTopUpModal(false);
    
    const checks = 3;
    const interval = 15000;
    
    for (let i = 0; i < checks; i++) {
      await new Promise(resolve => setTimeout(resolve, interval));
      await updateBalance();
    }
    
    setIsProcessing(false);
  };

    const handleModalClose = () => {
    setShowTopUpModal(false);
  };

  return (
    <>
      <section className="balance-section">
        <h2>Баланс</h2>
        <div className="balance-details">
          <div>
            <span>БАЛАНС</span>
            <span>{balance || '0'} USD</span>
          </div>
          <div>
            <span>ЗАМОРОЖЕНО</span>
            <span>{balance || '0'} USD</span>
          </div>
        </div>

        <button className="top-up-button" onClick={() => setShowTopUpModal(true)}>
          Пополнить баланс
        </button>

        {isProcessing && (
          <div className="processing-message">
            <span>Проверяем обновление баланса...</span>
            <div className="loading-spinner"></div>
          </div>
        )}
      </section>

      {showTopUpModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="top-up-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Пополнение баланса</h3>
              <button className="close-button" onClick={handleModalClose}>
                ×
              </button>
            </div>

            <p className="modal-subtitle">Переведите USDT в сети TRC20</p>

            <div className="modal-field">
              <label>Монета:</label>
              <div className="modal-value">USDT</div>
            </div>

            <div className="modal-field">
              <label>Сеть пополнения:</label>
              <div className="modal-value">TRC20</div>
            </div>

            <div className="modal-field">
              <label>Адрес кошелька:</label>
              <div className="modal-value wallet-address">
                TKSZC3Agw7nHSfqrZ41h12eZG7BMeUBJdS
                {/* TLF9tDwDb6EpPbS8x9knzPJzmmKBxqPeeL */}
                <button className="copy-button">📋</button>
              </div>
            </div>

            <button
              className="confirm-button"
              onClick={handlePaymentConfirmation}
            >
              Я пополнил
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .top-up-modal {
          background: #2a2a3e;
          color: white;
          border-radius: 12px;
          padding: 24px;
          width: 400px;
          max-width: 90vw;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .close-button {
          background: none;
          border: none;
          color: #888;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-button:hover {
          color: white;
        }
        
        .modal-subtitle {
          color: #ffa500;
          font-size: 14px;
          margin: 0 0 20px 0;
        }
        
        .modal-field {
          margin-bottom: 16px;
        }
        
        .modal-field label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        
        .modal-value {
          background: #1a1a2e;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          color: white;
          border: 1px solid #444;
        }
        
        .wallet-address {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: monospace;
          word-break: break-all;
        }
        
        .copy-button {
          background: #4a90e2;
          border: none;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 8px;
          font-size: 12px;
          flex-shrink: 0;
        }
        
        .copy-button:hover {
          background: #357abd;
        }
        
        .confirm-button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          width: 100%;
          margin-top: 20px;
          transition: background 0.3s;
        }
        
        .confirm-button:hover {
          background: #357abd;
        }

        /* Стили для сообщения о пополнении */
        .processing-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(74, 144, 226, 0.1);
          border-radius: 6px;
          color: #4a90e2;
          font-size: 14px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Стили для анимированного индикатора загрузки */
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(74, 144, 226, 0.3);
          border-radius: 50%;
          border-top-color: #4a90e2;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default BalanceSection;