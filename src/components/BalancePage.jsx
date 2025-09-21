import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import BalanceSection from './BalanceSection';
import HistoryTable from './HistoryTable';
import axios from 'axios';
import Header from './Header';

const BalancePage = ({ onLogout, user, userData, updateUserData }) => {
  
  return (
    <div className="balance-page">
      <Header user={user?.username} balance={userData?.balance} />
      <Sidebar activeTab="balance" onLogout={onLogout} user={user?.username} />
      <main className="content">
        <BalanceSection 
          balance={userData?.balance} 
          updateBalance={updateUserData} 
        />
        <HistoryTable />
      </main>
    </div>
  );
};

export default BalancePage;