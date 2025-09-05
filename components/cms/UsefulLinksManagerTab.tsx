import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiService, ApiError } from '../../src/services/api';

interface UsefulLink {
  id: number;
  link_key: string;
  title_bg: string;
  title_en: string;
  description_bg?: string;
  description_en?: string;
  url: string;
  cta_bg?: string;
  cta_en?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UsefulLinksContent {
  id: number;
  section_key: string;
  title_bg?: string;
  title_en?: string;
  content_bg?: string;
  content_en?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const UsefulLinksManagerTab: React.FC = () => {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  const [links, setLinks] = useState<UsefulLink[]>([]);
  const [content, setContent] = useState<UsefulLinksContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ type: 'link' | 'content'; id: number } | null>(null);
  const [editData, setEditData] = useState<{
    title?: string;
    description?: string;
    url?: string;
    cta?: string;
    content?: string;
  }>({});
  const [isSaving, setIsSaving] = useState<{ type: 'link' | 'content'; id: number } | null>(null);

  useEffect(() => {
    loadUsefulLinksContent();
  }, [navigate]);

  const loadUsefulLinksContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUsefulLinksForAdmin();
      setLinks(response.links);
      setContent(response.content);
    } catch (err) {
      console.error('Failed to load useful links content:', err);
      
      // Check if this is a backend connection error
      if (err instanceof ApiError && err.status === 0) {
        console.log('Backend connection error detected in CMS, redirecting to 404');
        navigate('/404', { replace: true });
        return;
      }
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.cms.usefulLinksManager.errorLoad);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLink = (link: UsefulLink) => {
    setEditingItem({ type: 'link', id: link.id });
    setEditData({
      title: locale === 'en' ? link.title_en : link.title_bg,
      description: locale === 'en' ? link.description_en : link.description_bg,
      url: link.url,
      cta: locale === 'en' ? link.cta_en : link.cta_bg,
    });
  };

  const handleEditContent = (contentItem: UsefulLinksContent) => {
    setEditingItem({ type: 'content', id: contentItem.id });
    setEditData({
      title: locale === 'en' ? contentItem.title_en : contentItem.title_bg,
      content: locale === 'en' ? contentItem.content_en : contentItem.content_bg,
    });
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    try {
      setIsSaving(editingItem);
      
      if (editingItem.type === 'link') {
        const updateData: any = {};
        if (locale === 'en') {
          if (editData.title !== undefined) updateData.title_en = editData.title;
          if (editData.description !== undefined) updateData.description_en = editData.description;
          if (editData.cta !== undefined) updateData.cta_en = editData.cta;
        } else {
          if (editData.title !== undefined) updateData.title_bg = editData.title;
          if (editData.description !== undefined) updateData.description_bg = editData.description;
          if (editData.cta !== undefined) updateData.cta_bg = editData.cta;
        }
        if (editData.url !== undefined) updateData.url = editData.url;
        
        await apiService.updateUsefulLink(editingItem.id.toString(), updateData);
      } else {
        const updateData: any = {};
        if (locale === 'en') {
          if (editData.title !== undefined) updateData.title_en = editData.title;
          if (editData.content !== undefined) updateData.content_en = editData.content;
        } else {
          if (editData.title !== undefined) updateData.title_bg = editData.title;
          if (editData.content !== undefined) updateData.content_bg = editData.content;
        }
        
        await apiService.updateUsefulLinksContent(editingItem.id.toString(), updateData);
      }
      
      // Reload content to get updated data
      await loadUsefulLinksContent();
      
      setEditingItem(null);
      setEditData({});
    } catch (err) {
      console.error('Failed to save:', err);
      
      // Check if this is a backend connection error
      if (err instanceof ApiError && err.status === 0) {
        console.log('Backend connection error during save, redirecting to 404');
        navigate('/404', { replace: true });
        return;
      }
      
      alert(t.cms.usefulLinksManager.errorLoad);
    } finally {
      setIsSaving(null);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditData({});
  };

  const getSectionDisplayName = (sectionKey: string): string => {
    const nameMap: Record<string, string> = {
      'intro': t.cms.usefulLinksManager.pageIntroduction,
      'footer_note': t.cms.usefulLinksManager.footerNote,
    };
    
    return nameMap[sectionKey] || sectionKey;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t.cms.usefulLinksManager.loading}</span>
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
        <h3 className="text-lg font-semibold text-red-800 mb-2">{t.cms.usefulLinksManager.error}</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadUsefulLinksContent}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          {t.cms.usefulLinksManager.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.cms.usefulLinksManager.title}</h2>
        <p className="text-gray-600">{t.cms.usefulLinksManager.description.replace('{lang}', locale.toUpperCase())}</p>
      </div>

      <div className="space-y-6">
        {/* Content Sections */}
        {content.map((contentItem) => (
          <div key={contentItem.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getSectionDisplayName(contentItem.section_key)}
                </h3>
                <p className="text-sm text-gray-500">
                  {t.cms.usefulLinksManager.key}: {contentItem.section_key} | {t.cms.usefulLinksManager.position}: {contentItem.position} | {t.cms.usefulLinksManager.language}: {locale}
                </p>
              </div>
              
              {(!editingItem || editingItem.type !== 'content' || editingItem.id !== contentItem.id) && (
                <button
                  onClick={() => handleEditContent(contentItem)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t.cms.usefulLinksManager.form.edit}
                </button>
              )}
            </div>

            {editingItem && editingItem.type === 'content' && editingItem.id === contentItem.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.cms.usefulLinksManager.form.titleLabel.replace('{lang}', locale.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    value={editData.title || ''}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.cms.usefulLinksManager.form.titlePlaceholder}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.cms.usefulLinksManager.form.contentLabel.replace('{lang}', locale.toUpperCase())}
                  </label>
                  <textarea
                    value={editData.content || ''}
                    onChange={(e) => setEditData({...editData, content: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.cms.usefulLinksManager.form.contentPlaceholder}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving && isSaving.type === 'content' && isSaving.id === contentItem.id}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isSaving && isSaving.type === 'content' && isSaving.id === contentItem.id ? t.cms.usefulLinksManager.form.saving : t.cms.usefulLinksManager.form.save}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving && isSaving.type === 'content' && isSaving.id === contentItem.id}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
                  >
                    {t.cms.usefulLinksManager.form.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                {/* Show title if available */}
                {(locale === 'en' ? contentItem.title_en : contentItem.title_bg) && (
                  <div>
                    <strong className="text-sm text-gray-600 uppercase">{t.cms.usefulLinksManager.preview.title.replace('{lang}', locale.toUpperCase())}</strong>
                    <p className="text-gray-900 font-medium">
                      {locale === 'en' ? contentItem.title_en : contentItem.title_bg}
                    </p>
                  </div>
                )}
                
                <div>
                  <strong className="text-sm text-gray-600 uppercase">{t.cms.usefulLinksManager.preview.content.replace('{lang}', locale.toUpperCase())}</strong>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {(locale === 'en' ? contentItem.content_en : contentItem.content_bg) || 
                     <span className="text-gray-500 italic">{t.cms.usefulLinksManager.preview.noContent}</span>}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Links */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.cms.usefulLinksManager.links}</h3>
          
          <div className="space-y-6">
            {links.map((link) => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {locale === 'en' ? link.title_en : link.title_bg}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t.cms.usefulLinksManager.key}: {link.link_key} | {t.cms.usefulLinksManager.position}: {link.position} | {t.cms.usefulLinksManager.language}: {locale}
                    </p>
                  </div>
                  
                  {(!editingItem || editingItem.type !== 'link' || editingItem.id !== link.id) && (
                    <button
                      onClick={() => handleEditLink(link)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {t.cms.usefulLinksManager.form.edit}
                    </button>
                  )}
                </div>

                {editingItem && editingItem.type === 'link' && editingItem.id === link.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.cms.usefulLinksManager.form.titleLabel.replace('{lang}', locale.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t.cms.usefulLinksManager.form.titlePlaceholder}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.cms.usefulLinksManager.form.descriptionLabel.replace('{lang}', locale.toUpperCase())}
                      </label>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t.cms.usefulLinksManager.form.descriptionPlaceholder}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.cms.usefulLinksManager.form.urlLabel}
                      </label>
                      <input
                        type="url"
                        value={editData.url || ''}
                        onChange={(e) => setEditData({...editData, url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t.cms.usefulLinksManager.form.urlPlaceholder}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.cms.usefulLinksManager.form.ctaLabel.replace('{lang}', locale.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        value={editData.cta || ''}
                        onChange={(e) => setEditData({...editData, cta: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t.cms.usefulLinksManager.form.ctaPlaceholder}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        disabled={isSaving && isSaving.type === 'link' && isSaving.id === link.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                      >
                        {isSaving && isSaving.type === 'link' && isSaving.id === link.id ? t.cms.usefulLinksManager.form.saving : t.cms.usefulLinksManager.form.save}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving && isSaving.type === 'link' && isSaving.id === link.id}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
                      >
                        {t.cms.usefulLinksManager.form.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div>
                      <strong className="text-sm text-gray-600 uppercase">{t.cms.usefulLinksManager.preview.title.replace('{lang}', locale.toUpperCase())}</strong>
                      <p className="text-gray-900 font-medium">
                        {locale === 'en' ? link.title_en : link.title_bg}
                      </p>
                    </div>
                    
                    {((locale === 'en' ? link.description_en : link.description_bg)) && (
                      <div>
                        <strong className="text-sm text-gray-600 uppercase">{t.cms.usefulLinksManager.preview.description.replace('{lang}', locale.toUpperCase())}</strong>
                        <p className="text-gray-700">
                          {locale === 'en' ? link.description_en : link.description_bg}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <strong className="text-sm text-gray-600 uppercase">{t.cms.usefulLinksManager.preview.url}</strong>
                      <p className="text-blue-600 hover:underline">
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.url}
                        </a>
                      </p>
                    </div>
                    
                    {((locale === 'en' ? link.cta_en : link.cta_bg)) && (
                      <div>
                        <strong className="text-sm text-gray-600 uppercase">{t.cms.usefulLinksManager.preview.cta.replace('{lang}', locale.toUpperCase())}</strong>
                        <p className="text-gray-700">
                          {locale === 'en' ? link.cta_en : link.cta_bg}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {links.length === 0 && content.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>{t.cms.usefulLinksManager.noContent}</p>
            <button
              onClick={loadUsefulLinksContent}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t.cms.usefulLinksManager.refresh}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsefulLinksManagerTab;