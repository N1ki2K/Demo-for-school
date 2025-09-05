import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService, ApiError } from '../../src/services/api';

interface Translation {
  id: string;
  key_path: string;
  text_bg: string | null;
  text_en: string | null;
  description: string | null;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TranslationsManagerTab: React.FC = () => {
  const { locale, refreshTranslations } = useLanguage();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    text_bg: string;
    text_en: string;
    description: string;
  }>({ text_bg: '', text_en: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    filterTranslations();
  }, [translations, searchTerm, selectedCategory]);

  const loadTranslations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/translations`);
      
      if (!response.ok) {
        throw new Error('Failed to load translations');
      }
      
      const data = await response.json();
      setTranslations(data.translations || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.translations?.map((t: Translation) => t.category) || [])];
      setCategories(uniqueCategories.sort());
      
    } catch (err) {
      console.error('Failed to load translations:', err);
      if (err instanceof ApiError && err.status === 0) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load translations');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterTranslations = () => {
    let filtered = translations;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.key_path.toLowerCase().includes(term) ||
        t.text_bg?.toLowerCase().includes(term) ||
        t.text_en?.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    setFilteredTranslations(filtered);
  };

  const handleEdit = (translation: Translation) => {
    setEditingId(translation.id);
    setEditData({
      text_bg: translation.text_bg || '',
      text_en: translation.text_en || '',
      description: translation.description || '',
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    try {
      setIsSaving(true);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/translations/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('cms_token')}`,
          },
          body: JSON.stringify(editData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save translation');
      }
      
      // Reload translations and refresh the language context
      await loadTranslations();
      await refreshTranslations();
      
      setEditingId(null);
      setEditData({ text_bg: '', text_en: '', description: '' });
      
    } catch (err) {
      console.error('Failed to save translation:', err);
      alert(err instanceof Error ? err.message : 'Failed to save translation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ text_bg: '', text_en: '', description: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading translations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-600 mb-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadTranslations}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Translations Manager</h2>
        <p className="text-gray-600">
          Edit website translations for both Bulgarian and English. Current language: <span className="font-semibold">{locale.toUpperCase()}</span>
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search translations</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by key, text, or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
          >
            <option value="">All categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredTranslations.length} of {translations.length} translations
      </div>

      {/* Translations list */}
      <div className="space-y-4">
        {filteredTranslations.map((translation) => (
          <div key={translation.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-mono">
                  {translation.key_path}
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  Category: {translation.category} | ID: {translation.id}
                </div>
                {translation.description && (
                  <p className="text-sm text-gray-600 mt-2 italic">{translation.description}</p>
                )}
              </div>
              
              {editingId !== translation.id && (
                <button
                  onClick={() => handleEdit(translation)}
                  className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {editingId === translation.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bulgarian Text</label>
                  <textarea
                    value={editData.text_bg}
                    onChange={(e) => setEditData({...editData, text_bg: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Enter Bulgarian translation..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English Text</label>
                  <textarea
                    value={editData.text_en}
                    onChange={(e) => setEditData({...editData, text_en: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Enter English translation..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Optional description for this translation..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <strong className="text-sm text-gray-600 uppercase block mb-2">Bulgarian (BG)</strong>
                  <p className="text-gray-900">
                    {translation.text_bg || <span className="text-gray-500 italic">No translation</span>}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <strong className="text-sm text-gray-600 uppercase block mb-2">English (EN)</strong>
                  <p className="text-gray-900">
                    {translation.text_en || <span className="text-gray-500 italic">No translation</span>}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTranslations.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>No translations found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TranslationsManagerTab;