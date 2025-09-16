import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';
import { useNavigationContext } from '../../context/NavigationContext';
import { useConfirm } from '../../hooks/useConfirm';
import ConfirmDialog from './ConfirmDialog';

interface MenuItem {
  id: string;
  title: string;
  path: string;
  position: number;
  isActive: boolean;
  parentId?: string | null;
  children?: MenuItem[];
  pdfFilename?: string;
  viewerType?: 'embed' | 'popup';
}

interface DocumentsMenuManagerTabProps {
  isActive: boolean;
}

const DocumentsMenuManagerTab: React.FC<DocumentsMenuManagerTabProps> = ({ isActive }) => {
  const { t, getTranslation } = useLanguage();
  const { reloadNavigation } = useNavigationContext();
  const { confirm, dialogProps } = useConfirm();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New menu item form state (always creates children of Documents)
  const [newItem, setNewItem] = useState({
    title: '',
    path: '/documents/',
    position: 0,
    isActive: true,
    parentId: 'documents', // Always set Documents as parent
    pdfFilename: '',
    viewerType: 'embed' // 'embed' for inline, 'popup' for separate page
  });

  // Document selection state
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);

  useEffect(() => {
    if (isActive) {
      loadMenuItems();
      loadAvailableDocuments();
    }
  }, [isActive]);

  const loadAvailableDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await apiService.getDocuments();
      setAvailableDocuments(response.documents || []);
    } catch (err) {
      console.error('Error loading documents:', err);
      setAvailableDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadMenuItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getNavigationMenuItems();
      setMenuItems(response.items);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error loading menu items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const itemToAdd = { ...newItem };
      if (newItem.pdfFilename) {
        const pathPrefix = newItem.viewerType === 'embed' ? '/documents/embed/' : '/documents/pdf/';
        itemToAdd.path = `${pathPrefix}${encodeURIComponent(newItem.pdfFilename)}`;
      }
      await apiService.createNavigationMenuItem(itemToAdd);
      setShowAddForm(false);
      setNewItem({ title: '', path: '/documents/', position: 0, isActive: true, parentId: 'documents', pdfFilename: '', viewerType: 'embed' });
      await loadMenuItems(); // Reload the list
      await reloadNavigation(); // Reload header navigation
    } catch (err) {
      setError('Failed to add menu item');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    let pdfFilename = '';
    let viewerType = 'embed';
    
    if (item.path.startsWith('/documents/pdf/')) {
      pdfFilename = decodeURIComponent(item.path.replace('/documents/pdf/', ''));
      viewerType = 'popup';
    } else if (item.path.startsWith('/documents/embed/')) {
      pdfFilename = decodeURIComponent(item.path.replace('/documents/embed/', ''));
      viewerType = 'embed';
    }
    
    setEditingItem({ 
      ...item, 
      pdfFilename: pdfFilename,
      viewerType: viewerType
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    try {
      const itemToUpdate = { ...editingItem };
      if (editingItem.pdfFilename) {
        const pathPrefix = editingItem.viewerType === 'embed' ? '/documents/embed/' : '/documents/pdf/';
        itemToUpdate.path = `${pathPrefix}${encodeURIComponent(editingItem.pdfFilename)}`;
      }
      
      await apiService.updateNavigationMenuItem(editingItem.id, {
        title: itemToUpdate.title,
        path: itemToUpdate.path,
        position: itemToUpdate.position,
        isActive: itemToUpdate.isActive,
        parentId: itemToUpdate.parentId
      });
      setEditingItem(null);
      await loadMenuItems(); // Reload the list
      await reloadNavigation(); // Reload header navigation
    } catch (err) {
      setError('Failed to update menu item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const confirmed = await confirm({
      title: 'Delete Menu Item',
      message: getTranslation('cms.documentsMenuManager.deleteConfirm', 'Are you sure you want to delete this menu item?'),
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true
    });

    if (!confirmed) {
      return;
    }
    
    try {
      await apiService.deleteNavigationMenuItem(itemId);
      await loadMenuItems(); // Reload the list
      await reloadNavigation(); // Reload header navigation
    } catch (err) {
      setError('Failed to delete menu item');
    }
  };

  const handleToggleActive = async (itemId: string, currentState: boolean) => {
    try {
      await apiService.toggleNavigationMenuItem(itemId);
      await loadMenuItems(); // Reload the list
      await reloadNavigation(); // Reload header navigation
    } catch (err) {
      setError('Failed to update menu item status');
    }
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {getTranslation('cms.documentsMenuManager.title', 'Documents Menu Manager')}
          </h2>
          <p className="text-gray-600 mt-2">
            {getTranslation('cms.documentsMenuManager.description', 'Manage navigation menu items for the Documents section.')}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {getTranslation('cms.documentsMenuManager.addMenuItem', 'Add Menu Item')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Add New Item Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {getTranslation('cms.documentsMenuManager.addNewItem', 'Add New Menu Item')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('cms.documentsMenuManager.title', 'Title')}
              </label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={getTranslation('cms.documentsMenuManager.titlePlaceholder', 'Menu item title')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('cms.documentsMenuManager.selectDocument', 'Select PDF Document')}
              </label>
              
              <div className="space-y-3">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    📄 Documents/
                  </span>
                  <input
                    type="text"
                    value={newItem.pdfFilename}
                    onChange={(e) => setNewItem({ ...newItem, pdfFilename: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example.pdf"
                    readOnly={showDocumentSelector}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDocumentSelector(!showDocumentSelector)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    {showDocumentSelector ? 'Hide' : 'Browse'}
                  </button>
                </div>
                
                {showDocumentSelector && (
                  <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto bg-white">
                    {loadingDocuments ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading documents...
                      </div>
                    ) : availableDocuments.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No PDF documents found. Upload documents in the file manager first.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {availableDocuments.map((doc) => (
                          <button
                            key={doc.filename}
                            type="button"
                            onClick={() => {
                              setNewItem({ ...newItem, pdfFilename: doc.filename });
                              setShowDocumentSelector(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">📄</span>
                              <div>
                                <p className="font-medium text-gray-800">{doc.filename}</p>
                                {doc.size && (
                                  <p className="text-xs text-gray-500">
                                    {(doc.size / 1024).toFixed(1)} KB
                                  </p>
                                )}
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Select a PDF document from the Documents folder on the server, or type the filename manually.
                </p>
              </div>
              
              {/* Viewer Type Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('cms.documentsMenuManager.viewerType', 'PDF Viewer Type')}
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="viewerType"
                      value="embed"
                      checked={newItem.viewerType === 'embed'}
                      onChange={(e) => setNewItem({ ...newItem, viewerType: e.target.value as 'embed' | 'popup' })}
                      className="mr-2"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">📄 Embedded Viewer</span>
                      <p className="text-xs text-gray-500">PDF displays inline on the page (recommended)</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="viewerType"
                      value="popup"
                      checked={newItem.viewerType === 'popup'}
                      onChange={(e) => setNewItem({ ...newItem, viewerType: e.target.value as 'embed' | 'popup' })}
                      className="mr-2"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">🔗 Separate Page</span>
                      <p className="text-xs text-gray-500">PDF opens in dedicated viewer page</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('cms.documentsMenuManager.position', 'Position')}
              </label>
              <input
                type="number"
                value={newItem.position}
                onChange={(e) => setNewItem({ ...newItem, position: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('cms.documentsMenuManager.parentItem', 'Parent Item')}
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                📁 Documents (Parent)
              </div>
              <p className="text-xs text-gray-500 mt-1">All new items will be added as children of the Documents menu.</p>
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              checked={newItem.isActive}
              onChange={(e) => setNewItem({ ...newItem, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              {getTranslation('cms.documentsMenuManager.isActive', 'Active')}
            </label>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAddItem}
              disabled={!newItem.title.trim() || !newItem.pdfFilename.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {getTranslation('cms.documentsMenuManager.save', 'Save')}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {getTranslation('cms.documentsMenuManager.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Menu Items List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {getTranslation('cms.documentsMenuManager.currentMenuItems', 'Current Menu Items')}
          </h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              {getTranslation('cms.documentsMenuManager.loading', 'Loading menu items...')}
            </span>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {menuItems.map((item) => (
              <div key={item.id}>
                {/* Parent Item */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        {(item.path.startsWith('/documents/pdf/') || item.path.startsWith('/documents/embed/')) && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.path.startsWith('/documents/embed/') 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.path.startsWith('/documents/embed/') ? '📄 Embedded PDF' : '🔗 PDF Popup'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{item.path}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 
                        getTranslation('cms.documentsMenuManager.active', 'Active') : 
                        getTranslation('cms.documentsMenuManager.inactive', 'Inactive')
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(item.id, item.isActive)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        item.isActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {item.isActive ? 
                        getTranslation('cms.documentsMenuManager.deactivate', 'Deactivate') : 
                        getTranslation('cms.documentsMenuManager.activate', 'Activate')
                      }
                    </button>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {getTranslation('cms.documentsMenuManager.edit', 'Edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      {getTranslation('cms.documentsMenuManager.delete', 'Delete')}
                    </button>
                  </div>
                </div>
                
                {/* Children Items */}
                {item.children && item.children.length > 0 && (
                  <div className="bg-gray-50 px-12 py-2">
                    {item.children.map((child) => (
                      <div key={child.id} className="py-2 flex items-center justify-between border-l-4 border-blue-200 pl-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <h5 className="text-sm font-medium text-gray-700">{child.title}</h5>
                              {(child.path.startsWith('/documents/pdf/') || child.path.startsWith('/documents/embed/')) && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  child.path.startsWith('/documents/embed/') 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {child.path.startsWith('/documents/embed/') ? '📄 Embedded PDF' : '🔗 PDF Popup'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{child.path}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            child.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {child.isActive ? 
                              getTranslation('cms.documentsMenuManager.active', 'Active') : 
                              getTranslation('cms.documentsMenuManager.inactive', 'Inactive')
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleActive(child.id, child.isActive)}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                              child.isActive 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {child.isActive ? 
                              getTranslation('cms.documentsMenuManager.deactivate', 'Deactivate') : 
                              getTranslation('cms.documentsMenuManager.activate', 'Activate')
                            }
                          </button>
                          <button
                            onClick={() => handleEditItem(child)}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors"
                          >
                            {getTranslation('cms.documentsMenuManager.edit', 'Edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(child.id)}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            {getTranslation('cms.documentsMenuManager.delete', 'Delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {getTranslation('cms.documentsMenuManager.editItem', 'Edit Menu Item')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('cms.documentsMenuManager.title', 'Title')}
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('cms.documentsMenuManager.selectDocument', 'Select PDF Document')}
                </label>
                
                <div className="space-y-3">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      📄 Documents/
                    </span>
                    <input
                      type="text"
                      value={editingItem.pdfFilename || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, pdfFilename: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="example.pdf"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDocumentSelector(!showDocumentSelector)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                    >
                      {showDocumentSelector ? 'Hide' : 'Browse'}
                    </button>
                  </div>
                  
                  {showDocumentSelector && (
                    <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto bg-white">
                      {loadingDocuments ? (
                        <div className="p-4 text-center text-gray-500">
                          Loading documents...
                        </div>
                      ) : availableDocuments.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No PDF documents found. Upload documents in the file manager first.
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {availableDocuments.map((doc) => (
                            <button
                              key={doc.filename}
                              type="button"
                              onClick={() => {
                                setEditingItem({ ...editingItem, pdfFilename: doc.filename });
                                setShowDocumentSelector(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">📄</span>
                                <div>
                                  <p className="font-medium text-gray-800">{doc.filename}</p>
                                  {doc.size && (
                                    <p className="text-xs text-gray-500">
                                      {(doc.size / 1024).toFixed(1)} KB
                                    </p>
                                  )}
                                </div>
                              </div>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Select a PDF document from the Documents folder on the server, or type the filename manually.
                  </p>
                </div>
                
                {/* Viewer Type Selection */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('cms.documentsMenuManager.viewerType', 'PDF Viewer Type')}
                  </label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editViewerType"
                        value="embed"
                        checked={editingItem.viewerType === 'embed'}
                        onChange={(e) => setEditingItem({ ...editingItem, viewerType: e.target.value as 'embed' | 'popup' })}
                        className="mr-2"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">📄 Embedded Viewer</span>
                        <p className="text-xs text-gray-500">PDF displays inline on the page</p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editViewerType"
                        value="popup"
                        checked={editingItem.viewerType === 'popup'}
                        onChange={(e) => setEditingItem({ ...editingItem, viewerType: e.target.value as 'embed' | 'popup' })}
                        className="mr-2"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">🔗 Separate Page</span>
                        <p className="text-xs text-gray-500">PDF opens in dedicated viewer</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('cms.documentsMenuManager.position', 'Position')}
                </label>
                <input
                  type="number"
                  value={editingItem.position}
                  onChange={(e) => setEditingItem({ ...editingItem, position: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingItem.isActive}
                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm text-gray-700">
                  {getTranslation('cms.documentsMenuManager.isActive', 'Active')}
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveEdit}
                disabled={!editingItem.title.trim() || !editingItem.pdfFilename?.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {getTranslation('cms.documentsMenuManager.save', 'Save')}
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {getTranslation('cms.documentsMenuManager.cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
};

export default DocumentsMenuManagerTab;