// components/cms/LoginButton.tsx
import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginButton: React.FC = () => {
  const { isLoggedIn, isEditing, login, logout, setIsEditing } = useCMS();
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
      invalidCredentials: 'Невалидни данни. Опитайте admin/admin123',
      enterUsername: 'Въведете потребителско име',
      enterPassword: 'Въведете парола',
      loginToCms: 'Влез в CMS',
      enterEditMode: 'Влез в режим на редактиране',
      exitEditMode: 'Излез от режим на редактиране',
      logoutFromCms: 'Излез от CMS'
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
      invalidCredentials: 'Invalid credentials. Try admin/admin123',
      enterUsername: 'Enter username',
      enterPassword: 'Enter password',
      loginToCms: 'Login to CMS',
      enterEditMode: 'Enter Edit Mode',
      exitEditMode: 'Exit Edit Mode',
      logoutFromCms: 'Logout from CMS'
    }
  };

  const t = texts[locale];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError(t.invalidCredentials);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (!isLoggedIn) {
    return (
      <>
        <button
          onClick={() => setShowLoginModal(true)}
          className="flex items-center px-3 py-1 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
          aria-label={t.loginToCms}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          {t.login}
        </button>

        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
            <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t.cmsLogin}</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">{t.username}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    {t.loginButton}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setLoginError('');
                      setUsername('');
                      setPassword('');
                    }}
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
              <div className="p-3 bg-gray-100 rounded text-sm text-gray-800">
                <div className="font-semibold mb-1">{t.demoCredentials}</div>
                <div>{t.username.replace(':', '')} <span className="font-mono">admin</span></div>
                <div>{t.password.replace(':', '')} <span className="font-mono">admin123</span></div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleEditMode}
        className={`flex items-center px-3 py-1 text-sm font-bold rounded-full transition-colors duration-300 ${
          isEditing 
            ? 'bg-red-600 text-white hover:bg-red-700' 
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
        aria-label={isEditing ? t.exitEditMode : t.enterEditMode}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isEditing ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          )}
        </svg>
        {isEditing ? t.exitEdit : t.edit}
      </button>
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