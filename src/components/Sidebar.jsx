import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'balance', label: 'Баланс', icon: 'account_balance', path: '/balance' },
    { id: 'banks', label: 'Банки', icon: 'account_balance_wallet', path: '/banks' },
    // { id: 'dashboard', label: 'дэшборд', icon: 'dashboard', path: '/dashboard' },
    { id: 'requests', label: 'Заявки', icon: 'assignment', path: '/requests' },
    { id: 'history', label: 'История заявок', icon: 'history', path: '/history' },
    { id: 'sms', label: 'SMS', icon: 'sms', path: '/sms' },
    // { id: 'settings', label: 'Настройки', icon: 'settings', path: '/settings' },
    { id: 'docs', label: 'Документация', icon: 'description', path: '/docs' },
    { id: 'support', label: 'Поддержка', icon: 'help_outline', path: '/support' },
    { id: 'exit', label: 'Выйти', icon: 'exit_to_app', path: '/login' },
  ];

  const handleItemClick = (path) => {
    if (path === '/login') {
      onLogout();
    }
    navigate(path);
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li
            key={item.id}
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item.path)}
          >
            <i className="material-icons">{item.icon}</i>
            <span className="menu-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;