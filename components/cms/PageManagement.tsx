import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';
import { Page } from '../../types';
import { pageTemplates } from './PageTemplates';
import { getMainNavigationCategories, getCategoryForPath, isPathInNavigation } from '../../utils/navigationCategories';

export const PageManagement: React.FC = () => {
  const { pages, addPage, updatePage, deletePage } = useCMS();
  const { locale, t } = useLanguage();
  
  // Get navigation categories
  const navigationCategories = useMemo(() => getMainNavigationCategories(t), [t]);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    path: '',
    content: '',
    category: 'custom',
    templateId: '',
    isPublished: true,
    metaDescription: '',
    keywords: ''
  });

  const texts = {
    bg: {
      pageManagement: 'Управление на страници',
      addNewPage: 'Добави нова страница',
      editPage: 'Редактирай страница',
      title: 'Заглавие',
      path: 'URL път',
      content: 'Съдържание',
      category: 'Категория',
      published: 'Публикувана',
      metaDescription: 'Meta описание',
      keywords: 'Ключови думи',
      save: 'Запази',
      cancel: 'Отмени',
      delete: 'Изтрий',
      edit: 'Редактирай',
      noPages: 'Няма създадени страници',
      confirmDelete: 'Сигурни ли сте, че искате да изтриете тази страница?',
      useTemplate: 'Използвай шаблон',
      selectTemplate: 'Избери шаблон',
      noTemplate: 'Без шаблон',
      template: 'Шаблон',
      pathWarning: 'Внимание: Този път вече съществува в навигацията'
    },
    en: {
      pageManagement: 'Page Management',
      addNewPage: 'Add New Page',
      editPage: 'Edit Page',
      title: 'Title',
      path: 'URL Path',
      content: 'Content',
      category: 'Category',
      published: 'Published',
      metaDescription: 'Meta Description',
      keywords: 'Keywords',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      noPages: 'No pages created',
      confirmDelete: 'Are you sure you want to delete this page?',
      useTemplate: 'Use Template',
      selectTemplate: 'Select Template',
      noTemplate: 'No Template',
      template: 'Template',
      pathWarning: 'Warning: This path already exists in navigation'
    }
  };

  const pageTexts = texts[locale];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      updatePage(editingPage.id, formData);
    } else {
      addPage(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      path: '',
      content: '',
      category: 'custom',
      templateId: '',
      isPublished: true,
      metaDescription: '',
      keywords: ''
    });
    setShowForm(false);
    setShowTemplateSelector(false);
    setEditingPage(null);
    setSelectedTemplate('');
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = pageTemplates[templateId];
    if (template) {
      setFormData(prev => ({
        ...prev,
        content: template.content,
        templateId: templateId
      }));
    }
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      path: page.path,
      content: page.content,
      category: page.category,
      templateId: page.templateId || '',
      isPublished: page.isPublished,
      metaDescription: page.metaDescription || '',
      keywords: page.keywords || ''
    });
    setShowForm(true);
  };

  const handleDelete = (page: Page) => {
    if (window.confirm(pageTexts.confirmDelete)) {
      deletePage(page.id);
    }
  };

  // Get category label for display
  const getCategoryLabel = (categoryId: string) => {
    const category = navigationCategories.find(cat => cat.id === categoryId);
    return category ? category.label : t.pageCategories?.custom || 'Custom';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-blue">{pageTexts.pageManagement}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-gold text-brand-blue px-4 py-2 rounded hover:bg-brand-gold-light transition-colors"
        >
          {pageTexts.addNewPage}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[400] p-4">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingPage ? pageTexts.editPage : pageTexts.addNewPage}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{pageTexts.title}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{pageTexts.path}</label>
                <input
                  type="text"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-blue"
                  placeholder="/custom/my-page"
                  required
                />
                {formData.path && isPathInNavigation(formData.path, t) && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ {pageTexts.pathWarning}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{pageTexts.category}</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setFormData({ ...formData, category: newCategory });
                    // Auto-suggest path based on category
                    if (!formData.path && newCategory !== 'custom' && newCategory !== 'main') {
                      const suggestedPath = `/${newCategory}/new-page`;
                      setFormData(prev => ({ ...prev, path: suggestedPath }));
                    }
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-blue"
                >
                  {navigationCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                  <option value="custom">{t.pageCategories?.custom || 'Custom'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{pageTexts.template}</label>
                <div className="flex gap-2">
                  <select
                    value={formData.templateId}
                    onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="">{pageTexts.noTemplate}</option>
                    {Object.values(pageTemplates).map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowTemplateSelector(true)}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                  >
                    {pageTexts.selectTemplate}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{pageTexts.content}</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-blue h-48"
                  placeholder={`<h1>Page Title</h1>\n<p>Your page content here...</p>\n<div class="bg-blue-100 p-4 rounded">\n  <p>You can use HTML tags and Tailwind CSS classes</p>\n</div>`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: You can use HTML tags and Tailwind CSS classes for styling
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{pageTexts.metaDescription}</label>
                <input
                  type="text"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-blue"
                  placeholder="SEO description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{pageTexts.keywords}</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-blue"
                  placeholder="SEO keywords, comma separated..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="published" className="text-sm font-medium">{pageTexts.published}</label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-brand-gold text-brand-blue px-4 py-2 rounded hover:bg-brand-gold-light transition-colors"
                >
                  {pageTexts.save}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[500] p-4">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{t.selectTemplate}</h3>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                onClick={() => handleTemplateSelect('')}
                className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
              >
                <div className="font-semibold text-gray-800 mb-2">{t.noTemplate}</div>
                <div className="text-sm text-gray-600">Start with a blank page</div>
              </div>
              
              {Object.values(pageTemplates).map(template => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <div className="font-semibold text-gray-800 mb-2">{template.name}</div>
                  <div className="text-sm text-gray-600 mb-3">{template.description}</div>
                  <div className="text-xs bg-gray-100 p-2 rounded text-gray-700">
                    {template.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">{pageTexts.title}</th>
              <th className="border p-2 text-left">{pageTexts.path}</th>
              <th className="border p-2 text-left">{pageTexts.category}</th>
              <th className="border p-2 text-left">{pageTexts.template}</th>
              <th className="border p-2 text-center">{pageTexts.published}</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={6} className="border p-4 text-center text-gray-500">
                  {pageTexts.noPages}
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="border p-2">{page.title}</td>
                  <td className="border p-2 font-mono text-sm">{page.path}</td>
                  <td className="border p-2">{getCategoryLabel(page.category)}</td>
                  <td className="border p-2 text-sm">
                    {page.templateId ? pageTemplates[page.templateId]?.name || 'Unknown' : pageTexts.noTemplate}
                  </td>
                  <td className="border p-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {page.isPublished ? '✓' : '✗'}
                    </span>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEdit(page)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2 hover:bg-blue-600"
                    >
                      {pageTexts.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(page)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      {pageTexts.delete}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};