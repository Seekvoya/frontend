import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [oneTimeCode, setOneTimeCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      validateToken(token, JSON.parse(userData));
    }
  }, []);

  const validateToken = async (token, userData) => {
    try {
      const response = await fetch('https://gpoint.pw:3001/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        onLogin(userData);
      } else if (response.status === 401) {
        clearAuthData();
      }
    } catch (err) {
      console.error('Ошибка валидации токена:', err);
      clearAuthData();
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  };

  const saveAuthData = (token, userData) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://gpoint.pw:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, oneTimeCode })
      });

      const data = await response.json();

      if (response.ok) {
        const userData = { username: username, ...data.user };
        saveAuthData(data.access_token, userData);
        onLogin(userData);
      } else {
        setError(data.message || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="url(#loginGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="url(#loginGradient)" strokeWidth="2" fill="none"/>
                    <path d="M20 8v6M23 11h-6" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="loginGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent tracking-tight">
                Overcards
              </h1>
              <p className="mt-2 text-slate-400 font-medium">Secure Trading Access</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500 font-mono">PLATFORM LOGIN</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 rounded-3xl"></div>
            <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl"></div>

            <div className="relative z-10 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-300">
                    <span className="text-red-400">●</span> Trading Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="oneTimeCode" className="block text-sm font-semibold text-slate-300">
                    <span className="text-red-400">●</span> Password
                  </label>
                  <input
                    id="oneTimeCode"
                    type="password"
                    value={oneTimeCode}
                    onChange={(e) => setOneTimeCode(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Login to Platform
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/registration')}
                    className="w-full py-3 px-4 bg-slate-800/60 border border-slate-600/50 text-slate-300 hover:text-white hover:border-slate-500/50 rounded-xl transition-all duration-300 hover:bg-slate-700/60 backdrop-blur-sm flex items-center justify-center group"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-slate-400 text-sm">
              Join thousands of traders worldwide
            </p>

            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 mt-6">
              <span>© {new Date().getFullYear()} overcards Trading</span>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span>All rights reserved</span>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-1 animate-pulse"></div>
                Secure SSL
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
