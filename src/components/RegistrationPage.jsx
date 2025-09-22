import React, { useState, useEffect } from 'react';

const RegistrationPage = ({ onLogin, navigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Mock navigate function if not provided
    const navigateToLogin = navigate || (() => console.log('Navigate to login'));

    // Проверяем, если пользователь уже авторизован - перенаправляем
    useEffect(() => {
        const token = localStorage?.getItem('access_token');
        const userData = localStorage?.getItem('user_data');
        
        if (token && userData && navigate) {
            navigate('/balance');
        }
    }, [navigate]);

    // Валидация username на соответствие требованиям DTO
    const validateUsername = (username) => {
        if (!username || username.length < 3) {
            return 'Имя пользователя должно содержать минимум 3 символа';
        }
        if (username.length > 50) {
            return 'Имя пользователя не должно превышать 50 символов';
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return 'Имя пользователя может содержать только буквы, цифры, дефисы и подчеркивания';
        }
        return null;
    };

    // Валидация пароля
    const validatePassword = (password) => {
        if (!password || password.length < 6) {
            return 'Пароль должен содержать минимум 6 символов';
        }
        if (password.length > 100) {
            return 'Пароль не должен превышать 100 символов';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Валидация на фронтенде
        const usernameError = validateUsername(username);
        if (usernameError) {
            setError(usernameError);
            setIsLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('https://gpoint.pw:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    oneTimeCode: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful! Auto-login in progress...');
                
                // После успешной регистрации сразу логиним пользователя
                setTimeout(async () => {
                    try {
                        const loginResponse = await fetch('https://gpoint.pw:3001/api/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                username: username.trim(),
                                oneTimeCode: password
                            })
                        });

                        const loginData = await loginResponse.json();

                        if (loginResponse.ok) {
                            // Сохраняем токен и данные пользователя
                            if (typeof localStorage !== 'undefined') {
                                localStorage.setItem('access_token', loginData.access_token);
                                localStorage.setItem('user_data', JSON.stringify({
                                    username: username,
                                    ...loginData.user
                                }));
                            }

                            // Вызываем onLogin с данными пользователя
                            onLogin({
                                username: username,
                                ...loginData.user
                            });
                        } else {
                            // Если автоматический логин не удался, перенаправляем на страницу входа
                            navigateToLogin('/login');
                        }
                    } catch (loginError) {
                        console.error('Ошибка автоматического входа:', loginError);
                        navigateToLogin('/login');
                    }
                }, 1500);

            } else {
                // Обработка ошибок валидации от сервера
                if (data.message && Array.isArray(data.message)) {
                    setError(data.message.join(', '));
                } else {
                    setError(data.message || 'Registration error');
                }
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Server connection error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Trading Pattern Background */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
                    <path d="M50 600 Q200 400 350 550 T650 500 Q800 450 950 600 T1150 550" 
                          stroke="url(#gradient1)" strokeWidth="2" fill="none" />
                    <path d="M50 700 Q150 500 300 650 T600 600 Q750 550 900 700 T1150 650" 
                          stroke="url(#gradient2)" strokeWidth="2" fill="none" />
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
                <div className="max-w-md w-full space-y-8">
                    
                    {/* Logo Section */}
                    <div className="text-center">
                        <div className="flex flex-col items-center justify-center mb-8">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                                
                                {/* Trading Registration Logo */}
                                <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none">
                                        {/* User Icon */}
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="url(#userGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="url(#userGradient)" strokeWidth="2" fill="none"/>
                                        
                                        {/* Plus icon */}
                                        <path d="M20 8v6M23 11h-6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        
                                        {/* Chart elements */}
                                        <rect x="2" y="16" width="1" height="3" fill="url(#chartGradient)" rx="0.5" />
                                        <rect x="4" y="14" width="1" height="5" fill="url(#chartGradient)" rx="0.5" />
                                        <rect x="6" y="17" width="1" height="2" fill="url(#chartGradient)" rx="0.5" />
                                        
                                        <defs>
                                            <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#22c55e" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                
                                {/* Floating indicators */}
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse border-2 border-slate-800"></div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full animate-ping border border-slate-800"></div>
                            </div>
                            
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
                                overcards
                            </h1>
                            <p className="mt-2 text-slate-400 font-medium">Join the Trading Revolution</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-slate-500 font-mono">NEW ACCOUNT CREATION</span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="relative">
                        {/* Glass morphism background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 rounded-3xl"></div>
                        <div className="absolute inset-0 border border-emerald-500/20 rounded-3xl"></div>
                        
                        <div className="relative z-10 p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Username Input */}
                                <div className="space-y-2">
                                    <label htmlFor="username" className="block text-sm font-semibold text-slate-300">
                                        <span className="text-red-400">●</span> Trading Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm"
                                            placeholder="Create your username (3-50 chars)"
                                            required
                                            autoFocus
                                            minLength="3"
                                            maxLength="50"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 ml-1">Letters, numbers, hyphens and underscores only</p>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
                                        <span className="text-red-400">●</span> Secure Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm"
                                            placeholder="Create secure password (min 6 chars)"
                                            required
                                            minLength="6"
                                            maxLength="100"
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300">
                                        <span className="text-red-400">●</span> Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm"
                                            placeholder="Confirm your password"
                                            required
                                            minLength="6"
                                            maxLength="100"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {error}
                                        </div>
                                    </div>
                                )}

                                {/* Success Message */}
                                {success && (
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm backdrop-blur-sm">
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {success}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {success ? 'Launching Platform...' : 'Creating Account...'}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                                </svg>
                                                Create Trading Account
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigateToLogin('/login')}
                                        className="w-full py-3 px-4 bg-slate-800/60 border border-slate-600/50 text-slate-300 hover:text-white hover:border-slate-500/50 rounded-xl transition-all duration-300 hover:bg-slate-700/60 backdrop-blur-sm flex items-center justify-center group"
                                        disabled={isLoading}
                                    >
                                        <svg className="w-5 h-5 mr-2 group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                        </svg>
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center space-y-4">
                        <p className="text-slate-400 text-sm">
                            Join thousands of successful traders
                        </p>
                        
                        <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 mt-6">
                            <span>© {new Date().getFullYear()} overcards Trading</span>
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                            <span>All rights reserved</span>
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                            <span className="flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
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

export default RegistrationPage;