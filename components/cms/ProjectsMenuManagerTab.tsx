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
  filename?: string;
  fileType?: 'pdf' | 'presentation';
  viewerType?: 'embed' | 'popup';
}

interface ProjectsMenuManagerTabProps {
  isActive: boolean;
}

const ProjectsMenuManagerTab: React.FC<ProjectsMenuManagerTabProps> = ({ isActive }) => {
  const { t, getTranslation } = useLanguage();
  const { reloadNavigation } = useNavigationContext();
  const { confirm, dialogProps } = useConfirm();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New menu item form state (always creates children of Projects)
  const [newItem, setNewItem] = useState({
    title: '',
    path: '/projects/',
    position: 0,
    isActive: true,
    parentId: 'projects', // Always set Projects as parent
    filename: '',
    fileType: 'presentation' as 'presentation',
    viewerType: 'embed' as 'embed' | 'popup'
  });

  // File selection state
  const [availableFiles, setAvailableFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [showFileSelector, setShowFileSelector] = useState(false);

  useEffect(() => {
    if (isActive) {
      loadMenuItems();
      loadAvailableFiles();
    }
  }, [isActive]);

  const loadAvailableFiles = async () => {
    setLoadingFiles(true);
    try {
      const presentationsResponse = await apiService.getPresentations();
      
      const presentations = (presentationsResponse.presentations || []).map((pres: any) => ({
        ...pres,
        fileType: 'presentation'
      }));
      
      setAvailableFiles(presentations);
    } catch (err) {
      console.error('Error loading files:', err);
      setAvailableFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  const loadMenuItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getNavigationMenuItems();
      // Filter to only show Projects-related menu items
      const projectsItems = response.items.filter((item: MenuItem) => 
        item.id === 'projects' || 
        item.parentId === 'projects' || 
        item.path.startsWith('/projects/')
      );
      setMenuItems(projectsItems);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error loading menu items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePath = (filename: string, viewerType: 'embed' | 'popup') => {
    const pathPrefix = viewerType === 'embed' ? '/projects/presentations/embed/' : '/projects/presentations/view/';
    return `${pathPrefix}${encodeURIComponent(filename)}`;
  };

  const parseItemPath = (path: string) => {
    let filename = '';
    let viewerType: 'embed' | 'popup' = 'embed';
    
    if (path.startsWith('/projects/presentations/view/')) {
      filename = decodeURIComponent(path.replace('/projects/presentations/view/', ''));
      viewerType = 'popup';
    } else if (path.startsWith('/projects/presentations/embed/')) {
      filename = decodeURIComponent(path.replace('/projects/presentations/embed/', ''));
      viewerType = 'embed';
    }
    
    return { filename, viewerType };
  };

  const handleAddItem = async () => {
    try {
      const itemToAdd = { ...newItem };
      if (newItem.filename) {
        itemToAdd.path = generatePath(newItem.filename, newItem.viewerType);
      }
      await apiService.createNavigationMenuItem(itemToAdd);
      setShowAddForm(false);
      setNewItem({ title: '', path: '/projects/', position: 0, isActive: true, parentId: 'projects', filename: '', fileType: 'presentation', viewerType: 'embed' });
      await loadMenuItems();
      await reloadNavigation();
    } catch (err) {
      setError('Failed to add menu item');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    const { filename, viewerType } = parseItemPath(item.path);
    
    setEditingItem({ 
      ...item, 
      filename,
      fileType: 'presentation',
      viewerType
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    try {
      const itemToUpdate = { ...editingItem };
      if (editingItem.filename) {
        itemToUpdate.path = generatePath(editingItem.filename, editingItem.viewerType || 'embed');
      }
      
      await apiService.updateNavigationMenuItem(editingItem.id, {
        title: itemToUpdate.title,
        path: itemToUpdate.path,
        position: itemToUpdate.position,
        isActive: itemToUpdate.isActive,
        parentId: itemToUpdate.parentId
      });
      setEditingItem(null);
      await loadMenuItems();
      await reloadNavigation();
    } catch (err) {
      setError('Failed to update menu item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const confirmed = await confirm({
      title: 'Delete Menu Item',
      message: getTranslation('cms.projectsMenuManager.deleteConfirm', 'Are you sure you want to delete this menu item?'),
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true
    });

    if (!confirmed) {
      return;
    }
    
    try {
      await apiService.deleteNavigationMenuItem(itemId);
      await loadMenuItems();
      await reloadNavigation();
    } catch (err) {
      setError('Failed to delete menu item');
    }
  };

  const handleToggleActive = async (itemId: string, currentState: boolean) => {
    try {
      await apiService.toggleNavigationMenuItem(itemId);
      await loadMenuItems();
      await reloadNavigation();
    } catch (err) {
      setError('Failed to update menu item status');
    }
  };

  const getViewerTypeLabel = (viewerType: 'embed' | 'popup') => {
    return viewerType === 'embed' ? '📊 Embedded Presentation' : '🔗 Presentation Viewer';
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {getTranslation('cms.projectsMenuManager.title', 'Projects Menu Manager')}
          </h2>
          <p className="text-gray-600 mt-2">
            {getTranslation('cms.projectsMenuManager.description', 'Manage navigation menu items for the Projects section.')}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {getTranslation('cms.projectsMenuManager.addMenuItem', 'Add Menu Item')}
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
            {getTranslation('cms.projectsMenuManager.addNewItem', 'Add New Menu Item')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('cms.projectsMenuManager.title', 'Title')}
              </label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={getTranslation('cms.projectsMenuManager.titlePlaceholder', 'Menu item title')}
              />
            </div>
            
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('cms.projectsMenuManager.selectFile', 'Select File')}
              </label>
              
              <div className="space-y-3">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    📊 Presentations/
                  </span>
                  <input
                    type="text"
                    value={newItem.filename}
                    onChange={(e) => setNewItem({ ...newItem, filename: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="presentation.pptx"
                    readOnly={showFileSelector}
                  />
                  <button
                    type="button"
                    onClick={() => setShowFileSelector(!showFileSelector)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    {showFileSelector ? 'Hide' : 'Browse'}
                  </button>
                </div>
                
                {showFileSelector && (
                  <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto bg-white">
                    {loadingFiles ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading files...
                      </div>
                    ) : availableFiles.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No presentations found. Upload files in the file manager first.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {availableFiles.map((file) => (
                            <button
                              key={file.filename}
                              type="button"
                              onClick={() => {
                                setNewItem({ ...newItem, filename: file.filename });
                                setShowFileSelector(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">📊</span>
                                <div>
                                  <p className="font-medium text-gray-800">{file.filename}</p>
                                  {file.size && (
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024).toFixed(1)} KB
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
                  Select a presentation from the server, or type the filename manually.
                </p>
              </div>
              
              {/* Viewer Type Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('cms.projectsMenuManager.viewerType', 'Viewer Type')}
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
                      <span className="text-sm font-medium text-gray-700">
                        📊 Embedded Viewer
                      </span>
                      <p className="text-xs text-gray-500">Presentation displays inline on the page (recommended)</p>
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
                      <p className="text-xs text-gray-500">Presentation opens in dedicated viewer page</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('cms.projectsMenuManager.position', 'Position')}
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
                {getTranslation('cms.projectsMenuManager.parentItem', 'Parent Item')}
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                📁 Projects (Parent)
              </div>
              <p className="text-xs text-gray-500 mt-1">All new items will be added as children of the Projects menu.</p>
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
              {getTranslation('cms.projectsMenuManager.isActive', 'Active')}
            </label>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAddItem}
              disabled={!newItem.title.trim() || !newItem.filename.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {getTranslation('cms.projectsMenuManager.save', 'Save')}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {getTranslation('cms.projectsMenuManager.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Menu Items List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {getTranslation('cms.projectsMenuManager.currentMenuItems', 'Current Menu Items')}
          </h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              {getTranslation('cms.projectsMenuManager.loading', 'Loading menu items...')}
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
                        {item.path.startsWith('/projects/presentations/') && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.path.includes('/embed/') 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getViewerTypeLabel(item.path.includes('/embed/') ? 'embed' : 'popup')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{item.path}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 
                        getTranslation('cms.projectsMenuManager.active', 'Active') : 
                        getTranslation('cms.projectsMenuManager.inactive', 'Inactive')
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
                        getTranslation('cms.projectsMenuManager.deactivate', 'Deactivate') : 
                        getTranslation('cms.projectsMenuManager.activate', 'Activate')
                      }
                    </button>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {getTranslation('cms.projectsMenuManager.edit', 'Edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      {getTranslation('cms.projectsMenuManager.delete', 'Delete')}
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
                              {child.path.startsWith('/projects/presentations/') && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  child.path.includes('/embed/') 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {getViewerTypeLabel(child.path.includes('/embed/') ? 'embed' : 'popup')}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{child.path}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            child.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {child.isActive ? 
                              getTranslation('cms.projectsMenuManager.active', 'Active') : 
                              getTranslation('cms.projectsMenuManager.inactive', 'Inactive')
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
                              getTranslation('cms.projectsMenuManager.deactivate', 'Deactivate') : 
                              getTranslation('cms.projectsMenuManager.activate', 'Activate')
                            }
                          </button>
                          <button
                            onClick={() => handleEditItem(child)}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors"
                          >
                            {getTranslation('cms.projectsMenuManager.edit', 'Edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(child.id)}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            {getTranslation('cms.projectsMenuManager.delete', 'Delete')}
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
              {getTranslation('cms.projectsMenuManager.editItem', 'Edit Menu Item')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('cms.projectsMenuManager.title', 'Title')}
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
                  {getTranslation('cms.projectsMenuManager.selectFile', 'Select File')}
                </label>
                
                <div className="space-y-3">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      📊 Presentations/
                    </span>
                    <input
                      type="text"
                      value={editingItem.filename || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, filename: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="presentation.pptx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFileSelector(!showFileSelector)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                    >
                      {showFileSelector ? 'Hide' : 'Browse'}
                    </button>
                  </div>
                  
                  {showFileSelector && (
                    <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto bg-white">
                      {loadingFiles ? (
                        <div className="p-4 text-center text-gray-500">
                          Loading files...
                        </div>
                      ) : availableFiles.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No presentations found. Upload files in the file manager first.
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {availableFiles.map((file) => (
                              <button
                                key={file.filename}
                                type="button"
                                onClick={() => {
                                  setEditingItem({ ...editingItem, filename: file.filename });
                                  setShowFileSelector(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">📊</span>
                                  <div>
                                    <p className="font-medium text-gray-800">{file.filename}</p>
                                    {file.size && (
                                      <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(1)} KB
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
                    Select a presentation from the server, or type the filename manually.
                  </p>
                </div>
                
                {/* Viewer Type Selection */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('cms.projectsMenuManager.viewerType', 'Viewer Type')}
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
                        <span className="text-sm font-medium text-gray-700">
                          📊 Embedded Viewer
                        </span>
                        <p className="text-xs text-gray-500">Presentation displays inline on the page</p>
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
                        <p className="text-xs text-gray-500">Presentation opens in dedicated viewer</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('cms.projectsMenuManager.position', 'Position')}
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
                  {getTranslation('cms.projectsMenuManager.isActive', 'Active')}
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveEdit}
                disabled={!editingItem.title.trim() || !editingItem.filename?.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {getTranslation('cms.projectsMenuManager.save', 'Save')}
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {getTranslation('cms.projectsMenuManager.cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
};

export default ProjectsMenuManagerTab;