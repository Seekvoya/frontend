import React, { useState, useEffect } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { apiRequest, getAuthToken } from '../utils/authApi';

const AddBankModal = ({ isOpen, onClose, onAddBank }) => {
  const [selectedBank, setSelectedBank] = useState("")
  const [phone, setPhone] = useState("")
  const [holder, setHolder] = useState("")
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const bankOptions = [
    // Россия
    "Сбербанк", "Альфа-Банк", "ВТБ", "Газпромбанк", "Россельхозбанк", 
    "Тинькофф Банк", "Райффайзенбанк", "Абсолют Банк", "Совкомбанк", "Открытие",
    
    // США
    "JPMorgan Chase", "Bank of America", "Wells Fargo", "Citigroup", "Goldman Sachs",
    "Morgan Stanley", "U.S. Bancorp", "PNC Financial Services", "TD Bank", "Capital One",
    
    // Европа
    "HSBC", "Barclays", "BNP Paribas", "Deutsche Bank", "Société Générale",
    "Santander", "Credit Suisse", "UBS", "ING Group", "UniCredit",
    
    // Азия
    "ICBC (Industrial and Commercial Bank of China)", "China Construction Bank", "Agricultural Bank of China",
    "Bank of China", "Mitsubishi UFJ Financial Group", "Sumitomo Mitsui Financial Group", "Mizuho Financial Group",
    "HDFC Bank", "State Bank of India", "Bank of Tokyo-Mitsubishi",
    
    // Ближний Восток
    "Qatar National Bank", "Emirates NBD", "Saudi National Bank", "First Abu Dhabi Bank", "Kuwait Finance House",
    
    // Латинская Америка
    "Banco do Brasil", "Itaú Unibanco", "Caixa Econômica Federal", "Banco Bradesco", "Banco Santander México",
    
    // Африка
    "Standard Bank Group", "FirstRand Bank", "Absa Group", "Nedbank", "Attijariwafa Bank",
    
    // Австралия и Океания
    "Commonwealth Bank", "Westpac", "ANZ Bank", "National Australia Bank",

    "ANORBANK", "Hamkorbank", "Trustbank", "Ipak Yuli Bank",

    "Claropay", "BanzaLemonMi", "saldo Personal pay", "Lemon",

    "МБанк", "Айыл Банк", "Элдик Банк", "Оптима Банк", "ФИНКА Банк", "Капитал Банк", "БАКАЙ Банк",

    "Эсхата банк", "Алиф Банк ", "Душанбе Сити банк", "Spitamenbank ",

    "Kaspi", "Vodafone", "Cash", "Orange", "Cash", "Etisalat", "Cash", "We Pay", "InstaPay"
  ];

  const resetForm = () => {
    setSelectedBank("")
    setPhone("")
    setHolder("")
    setComment("")
    setError("")
  }

  const handleSubmit = async () => {
    if (!selectedBank || !phone || !holder) {
      setError("Заполните все обязательные поля")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await apiRequest.post('/banks', {
        bank: selectedBank,
        phone,
        holder,
        comment: comment || undefined,
      })

      onAddBank(response.data)
      resetForm()
      onClose()
    } catch (err) {
      console.error('Error adding bank:', err)
      setError(err.response?.data?.message || 'Не удалось добавить банк')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Новый банк</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="modal-form">
          {error && (
            <div className="error-message">
              <svg className="inline mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label><span className="required">*</span> Выбрать банк</label>
            <select
              value={selectedBank}
              onChange={e => setSelectedBank(e.target.value)}
              className="form-select"
              disabled={isLoading}
              required
            >
              <option value="">Выбрать банк</option>
              {bankOptions.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><span className="required">*</span> Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="form-input"
              placeholder="+7 XXX XXX XX XX"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label><span className="required">*</span> ФИО Держателя</label>
            <input
              type="text"
              value={holder}
              onChange={e => setHolder(e.target.value)}
              className="form-input"
              placeholder="Введите ФИО"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label>Комментарий</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="form-textarea"
              placeholder="Дополнительная информация"
              disabled={isLoading}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={isLoading || !selectedBank || !phone || !holder}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Добавление...
                </>
              ) : (
                'Добавить банк'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ------------------- Карточка банка -------------------
const BankCard = ({ bank, onToggleStatus, onManage, onDelete, isLoading }) => {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggleStatus = async () => {
    setIsToggling(true)
    await onToggleStatus(bank.id)
    setIsToggling(false)
  }

  return (
    <div className="bank-card">
      <div className="bank-card-header">
        <div className="bank-main-info">
          <div className="bank-phone">{bank.phone}</div>
          <div className="bank-name">{bank.bank}</div>
          <div className="bank-holder">{bank.holder}</div>
        </div>
        <div className="bank-status-section">
          <div className={`bank-status ${bank.status.toLowerCase()}`}>{bank.status}</div>
          <div className="bank-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={bank.status === "Активный"}
                onChange={handleToggleStatus}
                disabled={isToggling || isLoading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="bank-card-footer">
        <div className="bank-actions-links">
          <button className="bank-link">Платежные реквизиты</button>
          <button 
            className="bank-link" 
            onClick={() => onManage(bank.id)}
            disabled={isLoading}
          >
            Управление банком
          </button>
          <button 
            className="bank-link danger" 
            onClick={() => onDelete(bank.id)}
            disabled={isLoading}
          >
            Удалить
          </button>
        </div>
      </div>

      {bank.comment && (
        <div className="bank-comment">
          <strong>Комментарий:</strong> {bank.comment}
        </div>
      )}
    </div>
  )
}

// ------------------- Главная страница -------------------
const BanksPage = ({ onLogout, user, userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [banks, setBanks] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Загрузка банков при монтировании компонента
  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await apiRequest.get('/banks')
      setBanks(response.data)
    } catch (err) {
      console.error('Error fetching banks:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки банков')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBank = (newBank) => {
    setBanks((prev) => [newBank, ...prev])
  }

  const handleToggleStatus = async (bankId) => {
    try {
      const response = await apiRequest.patch(`/banks/${bankId}/toggle-status`)
      setBanks((prev) => prev.map((b) => (b.id === bankId ? response.data : b)))
    } catch (err) {
      console.error('Error toggling bank status:', err)
      alert(err.response?.data?.message || 'Не удалось изменить статус банка')
    }
  }

  const handleDeleteBank = async (bankId) => {
    if (!window.confirm("Удалить этот банк?")) return
    
    try {
      await apiRequest.delete(`/banks/${bankId}`)
      setBanks((prev) => prev.filter((b) => b.id !== bankId))
    } catch (err) {
      console.error('Error deleting bank:', err)
      alert(err.response?.data?.message || 'Не удалось удалить банк')
    }
  }

  const handleManageBank = (bankId) => {
    console.log("Управление банком:", bankId)
    // TODO: Реализовать управление банком
  }

  // Фильтрация банков
  const getFilteredBanks = () => {
    switch (activeFilter) {
      case "active":
        return banks.filter((bank) => bank.status === "Активный")
      case "inactive":
        return banks.filter((bank) => bank.status === "Неактивный")
      default:
        return banks
    }
  }

  const filteredBanks = getFilteredBanks()
  const activeBanks = banks.filter((b) => b.status === "Активный")
  const inactiveBanks = banks.filter((b) => b.status === "Неактивный")

  if (isLoading) {
    return (
      <div className="balance-page">
        <Header user={user?.username || userData?.username} balance={user?.balance || userData?.balance} />
        <Sidebar activeTab="banks" onLogout={onLogout} user={user?.username || userData?.username} />
        
        <main className="content">
          <div className="loading-container">
            <svg className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400">Загрузка банков...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="balance-page">
      <Header user={user?.username || userData?.username} balance={user?.balance || userData?.balance} />
      <Sidebar activeTab="banks" onLogout={onLogout} user={user?.username || userData?.username} />

      <main className="content">
        <section className="balance-section">
        <h2>Банки</h2>
        </section>
        {error && (
          <div className="error-banner">
            <svg className="inline mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {error}
            <button onClick={fetchBanks} className="retry-btn">
              Повторить
            </button>
          </div>
        )}

        <div className="banks-container">
          <div className="banks-header">
            <h2>Управление банками</h2>
            <div className="bank-actions">
              <button className="bank-action-btn primary" onClick={() => setIsModalOpen(true)}>
                + ДОБАВИТЬ БАНК
              </button>
            </div>
          </div>

          <div className="bank-filters">
            <button 
              className={`filter ${activeFilter === "all" ? "active" : ""}`} 
              onClick={() => setActiveFilter("all")}
            >
              Все {banks.length}
            </button>
            <button 
              className={`filter ${activeFilter === "active" ? "active" : ""}`} 
              onClick={() => setActiveFilter("active")}
            >
              Активные {activeBanks.length}
            </button>
            <button 
              className={`filter ${activeFilter === "inactive" ? "active" : ""}`} 
              onClick={() => setActiveFilter("inactive")}
            >
              Неактивные {inactiveBanks.length}
            </button>
          </div>

          <div className="banks-list">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank) => (
                <BankCard
                  key={bank.id}
                  bank={bank}
                  onToggleStatus={handleToggleStatus}
                  onManage={handleManageBank}
                  onDelete={handleDeleteBank}
                  isLoading={false}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏦</div>
                <h3>
                  {activeFilter === "all" && "Нет банков"}
                  {activeFilter === "active" && "Нет активных банков"}
                  {activeFilter === "inactive" && "Нет неактивных банков"}
                </h3>
                <p>
                  {activeFilter === "all" && "Добавьте первый банк для начала работы"}
                  {activeFilter === "active" && "Все ваши банки неактивны"}
                  {activeFilter === "inactive" && "У вас нет неактивных банков"}
                </p>
                {activeFilter === "all" && (
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    Добавить банк
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <AddBankModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddBank={handleAddBank} />

      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .error-banner {
          background-color: rgba(248, 81, 73, 0.1);
          border: 1px solid rgba(248, 81, 73, 0.3);
          color: #f85149;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .retry-btn {
          background: none;
          border: 1px solid #f85149;
          color: #f85149;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .retry-btn:hover {
          background-color: #f85149;
          color: white;
        }

        .error-message {
          background-color: rgba(248, 81, 73, 0.1);
          border: 1px solid rgba(248, 81, 73, 0.3);
          color: #f85149;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid #30363d;
          color: #e6edf3;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover:not(:disabled) {
          border-color: #58a6ff;
          color: #58a6ff;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .menu-icon {
          font-size: 16px;
          margin-right: 8px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #161b22;
          border-radius: 12px;
          padding: 0;
          width: 500px;
          max-width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid #30363d;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #30363d;
        }

        .modal-header h3 {
          margin: 0;
          color: #e6edf3;
          font-size: 18px;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          color: #8b949e;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background-color: #30363d;
          color: #e6edf3;
        }

        .modal-form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #e6edf3;
          font-size: 14px;
        }

        .required {
          color: #f85149;
          margin-right: 4px;
        }

        .form-select, .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #30363d;
          border-radius: 6px;
          background-color: #21262d;
          color: #e6edf3;
          font-size: 14px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-select:focus, .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #58a6ff;
          box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
        }

        .form-select:disabled, .form-input:disabled, .form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #58a6ff, #7c3aed);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(88, 166, 255, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .bank-card {
          background-color: #21262d;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
        }

        .bank-card:hover {
          border-color: #58a6ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .bank-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .bank-main-info {
          flex: 1;
        }

        .bank-phone {
          font-size: 16px;
          font-weight: 600;
          color: #e6edf3;
          margin-bottom: 4px;
        }

        .bank-name {
          font-size: 14px;
          color: #58a6ff;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .bank-holder {
          font-size: 14px;
          color: #8b949e;
        }

        .bank-status-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bank-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .bank-status.активный {
          background-color: rgba(35, 134, 54, 0.15);
          color: #238636;
          border: 1px solid rgba(35, 134, 54, 0.3);
        }

        .bank-status.неактивный {
          background-color: rgba(248, 81, 73, 0.15);
          color: #f85149;
          border: 1px solid rgba(248, 81, 73, 0.3);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #30363d;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .toggle-slider:before {
          position: absolute;
          content: '';
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: #e6edf3;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .toggle-switch input:checked + .toggle-slider {
          background-color: #58a6ff;
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .toggle-switch input:disabled + .toggle-slider {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bank-card-footer {
          border-top: 1px solid #30363d;
          padding-top: 16px;
        }

        .bank-actions-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .bank-link {
          background: none;
          border: none;
          color: #58a6ff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          padding: 0;
        }

        .bank-link:hover:not(:disabled) {
          color: #7c3aed;
          text-decoration: underline;
        }

        .bank-link:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bank-link.danger {
          color: #f85149;
        }

        .bank-link.danger:hover:not(:disabled) {
          color: #ff6b6b;
        }

        .bank-comment {
          margin-top: 12px;
          padding: 12px;
          background-color: #161b22;
          border-radius: 6px;
          border: 1px solid #30363d;
          font-size: 14px;
          color: #8b949e;
        }

        .banks-container {
          max-width: 1200px;
        }

        .banks-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .banks-header h2 {
          color: #e6edf3;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }

        .bank-actions {
          display: flex;
          gap: 12px;
        }

        .bank-action-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .bank-action-btn.primary {
          background: linear-gradient(135deg, #58a6ff, #7c3aed);
          color: white;
        }

        .bank-action-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(88, 166, 255, 0.3);
        }

        .bank-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .filter {
          padding: 8px 16px;
          border: 1px solid #30363d;
          border-radius: 6px;
          background-color: transparent;
          color: #8b949e;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .filter:hover {
          border-color: #58a6ff;
          color: #58a6ff;
        }

        .filter.active {
          background-color: #58a6ff;
          border-color: #58a6ff;
          color: white;
        }

        .banks-list {
          margin-top: 24px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #8b949e;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.6;
        }

        .empty-state h3 {
          color: #e6edf3;
          font-size: 20px;
          margin-bottom: 8px;
        }

        .empty-state p {
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95vw;
            margin: 20px;
          }
          
          .bank-card-header {
            flex-direction: column;
            gap: 12px;
          }
          
          .bank-status-section {
            align-self: flex-start;
          }
          
          .bank-actions-links {
            flex-direction: column;
            gap: 12px;
          }

          .banks-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .bank-filters {
            flex-wrap: wrap;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default BanksPage