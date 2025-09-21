import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import BalancePage from './BalancePage';
import BanksPage from './BanksPage';
import RegistrationPage from './RegistrationPage';
import SupportPage from './SupportPage';
import RequestsPage from './RequestsPage';
import HistoryPage from './HistoryPage';
import SmsPage from './SmsPage';
import DocumentationPage from './DocumentationPage';
import { getAuthToken, getUserData, clearAuthData, validateToken } from '../utils/authApi';

const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const storedUserData = getUserData();

      if (token && storedUserData) {
        try {
          const isValid = await validateToken();

          if (isValid) {
            setUser(storedUserData);
            setUserData(storedUserData);
            setIsAuthenticated(true);
            await updateUserData(storedUserData.username);
          } else {
            clearAuthData();
            setUser(null);
            setUserData(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Ошибка проверки авторизации:', error);
          clearAuthData();
          setUser(null);
          setUserData(null);
          setIsAuthenticated(false);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (newUserData) => {
    setUser(newUserData);
    setUserData(newUserData);
    setIsAuthenticated(true);
  };

  const updateUserData = async (username = user?.username) => {
    if (!username) return;

    try {
      const token = getAuthToken();
      const response = await axios.get(
        `https://gpoint.pw:3001/api/auth/check/${username}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const updatedData = {
        ...user,
        ...response.data
      };

      setUserData(updatedData);
      localStorage.setItem('user_data', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/balance" replace /> : <LoginPage onLogin={handleLogin} />
          }
        />

        <Route
          path="/registration"
          element={
            isAuthenticated ? <Navigate to="/balance" replace /> : <RegistrationPage onLogin={handleLogin} />
          }
        />

        <Route
          path="/balance"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <BalancePage user={user} userData={userData} onLogout={handleLogout} updateUserData={updateUserData} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/banks"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <BanksPage user={user} userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <SupportPage user={user} userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <RequestsPage user={user} userData={userData} onLogout={handleLogout} updateUserData={updateUserData} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <HistoryPage user={user} userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sms"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <SmsPage user={user} userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/balance" : "/login"} replace />}
        />

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/balance" : "/login"} replace />}
        />
        <Route
          path="/docs"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <DocumentationPage user={user} userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
