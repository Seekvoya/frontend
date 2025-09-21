import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const PageLayout = ({ children, activeTab, onLogout, user, balance }) => {
  return (
    <div className="balance-page">
      <Header user={user?.username || user?.name} balance={balance} />
      <Sidebar activeTab={activeTab} onLogout={onLogout} />
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
