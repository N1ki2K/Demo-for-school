import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MediaManagerDashboard } from './MediaManagerDashboard';
import { ContentEditor } from './ContentEditor';
import { StaffManagementDashboard } from './StaffManagementDashboard';
import ContentManagementDashboard from './ContentManagementDashboard';

type DashboardTab = 'content' | 'staff' | 'media' | 'settings';

export const CMSDashboard: React.FC = () => {
  const { isLoggedIn, isEditing, isLoading, error, clearError } = useCMS();
  const [activeTab, setActiveTab] = useState<DashboardTab>('content');

  if (!isLoggedIn || !isEditing) {
    return null;
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'media', label: 'Media', icon: '🖼️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">CMS Dashboard</h2>
          <button
            onClick={() => window.location.reload()}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mx-4 mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <div className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r overflow-y-auto">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'content' && <ContentManagementDashboard />}
            {activeTab === 'staff' && <StaffManagementDashboard />}
            {activeTab === 'media' && <MediaManagerDashboard />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel: React.FC = () => {
  const { isLoading } = useCMS();
  const [settings, setSettings] = useState({
    siteTitle: 'School Website',
    siteDescription: 'Welcome to our school',
    contactEmail: 'info@school.com',
    contactPhone: '+1234567890',
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Site Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Site Title</label>
          <input
            type="text"
            value={settings.siteTitle}
            onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Email</label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Site Description</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Phone</label>
          <input
            type="tel"
            value={settings.contactPhone}
            onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        Save Settings
      </button>
    </div>
  );
};