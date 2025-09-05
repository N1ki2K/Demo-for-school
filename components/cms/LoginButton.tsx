// components/cms/LoginButton.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginButton: React.FC = () => {
  const { isLoggedIn, isEditing, isLoading, error, login, logout, setIsEditing, clearError } = useCMS();
  const { locale } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const texts = {
    bg: {
      login: 'Вход',
      edit: 'Редактирай',
      exitEdit: 'Изход от редакция',
      logout: 'Изход',
      cmsLogin: 'CMS Вход',
      username: 'Потребителско име:',
      password: 'Парола:',
      loginButton: 'Влез',
      cancel: 'Отказ',
      demoCredentials: 'Демо данни:',
      invalidCredentials: 'Невалидни потребителски данни',
      enterUsername: 'Въведете потребителско име',
      enterPassword: 'Въведете парола',
      loginToCms: 'Влез в CMS',
      enterEditMode: 'Влез в режим на редактиране',
      exitEditMode: 'Излез от режим на редактиране',
      logoutFromCms: 'Излез от CMS',
      dashboard: 'Табло'
    },
    en: {
      login: 'Login',
      edit: 'Edit',
      exitEdit: 'Exit Edit',
      logout: 'Logout',
      cmsLogin: 'CMS Login',
      username: 'Username:',
      password: 'Password:',
      loginButton: 'Login',
      cancel: 'Cancel',
      demoCredentials: 'Demo Credentials:',
      invalidCredentials: 'Invalid credentials',
      enterUsername: 'Enter username',
      enterPassword: 'Enter password',
      loginToCms: 'Login to CMS',
      enterEditMode: 'Enter Edit Mode',
      exitEditMode: 'Exit Edit Mode',
      logoutFromCms: 'Logout from CMS',
      dashboard: 'Dashboard'
    }
  };

  const t = texts[locale];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    clearError();
    
    const success = await login(username, password);
    if (success) {
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError(error || t.invalidCredentials);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (!isLoggedIn) {
    return (
      <>
        <button
          onClick={() => setShowLoginModal(true)}
          className="flex items-center px-3 py-1 text-sm font-bold text-white bg-brand-blue rounded-full hover:bg-brand-blue-light transition-colors duration-300"
          aria-label={t.loginToCms}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          {t.login}
        </button>

        {showLoginModal && (
          <div className="login-modal-overlay fixed inset-0 bg-black bg-opacity-20 flex items-start justify-center" style={{zIndex: 10000, paddingTop: '80px'}}>
            <div className="login-modal-content bg-white p-6 rounded-lg w-full max-w-md mx-4 border-0 shadow-none" style={{zIndex: 10001}}>
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t.cmsLogin}</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">{t.username}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-gray-900 bg-white"
                    required
                    autoFocus
                    placeholder={t.enterUsername}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">{t.password}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-gray-900 bg-white"
                    required
                    placeholder={t.enterPassword}
                  />
                </div>
                {loginError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {loginError}
                  </div>
                )}
                <div className="flex gap-3 mb-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-brand-blue text-white py-2 px-4 rounded hover:bg-brand-blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : t.loginButton}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setLoginError('');
                      setUsername('');
                      setPassword('');
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link
        to="/cms-dashboard"
        className="flex items-center px-3 py-1 text-sm font-bold text-white bg-brand-gold rounded-full hover:bg-brand-gold-light transition-colors duration-300"
        title={t.dashboard}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
        </svg>
        {t.dashboard}
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center px-3 py-1 text-sm font-bold text-white bg-gray-600 rounded-full hover:bg-gray-700 transition-colors duration-300"
        aria-label={t.logoutFromCms}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        {t.logout}
      </button>
    </div>
  );
};