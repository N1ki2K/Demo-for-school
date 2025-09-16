import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';
import ContactManagerTab from './ContactManagerTab';
import InfoAccessManagerTab from './InfoAccessManagerTab';
import CalendarManagerTab from './CalendarManagerTab';
import PatronManagerTab from './PatronManagerTab';
import UsefulLinksManagerTab from './UsefulLinksManagerTab';
import TranslationsManagerTab from './TranslationsManagerTab';
import ConfirmDialog from './ConfirmDialog';
import { useConfirm } from '../../hooks/useConfirm';
import DocumentsMenuManagerTab from './DocumentsMenuManagerTab';
import ProjectsMenuManagerTab from './ProjectsMenuManagerTab';
import AchievementsDirectorsManager from './AchievementsDirectorsManager';

// Reusable Image Picker Component for selecting from Pictures folder
interface ImagePickerProps {
  onImageSelect: (imageUrl: string, filename: string) => void;
  currentImage?: string;
  onClose: () => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelect, currentImage, onClose }) => {
  const { t } = useLanguage();
  const [picturesImages, setPicturesImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPicturesImages();
  }, []);

  const loadPicturesImages = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPicturesImages();
      setPicturesImages(response.images || []);
    } catch (error) {
      console.error('❌ Failed to load Pictures folder images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages = picturesImages.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📁 {t.cms.imagePicker.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={t.cms.imagePicker.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">{t.cms.imagePicker.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
            {filteredImages.map((image) => {
              const imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${image.url}`;
              const isSelected = currentImage === imageUrl || currentImage === image.url;
              
              return (
                <div 
                  key={image.filename} 
                  className={`border-2 rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => onImageSelect(imageUrl, image.filename)}
                >
                  <div className="aspect-square mb-2 bg-gray-200 rounded overflow-hidden">
                    <img 
                      src={imageUrl}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Error';
                      }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-700 truncate" title={image.filename}>
                    {image.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(image.size)}
                  </p>
                  {isSelected && (
                    <div className="text-center mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        ✓ Selected
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredImages.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? `No images found matching "${searchTerm}"` : t.cms.imagePicker.noImages}
                </p>
                {!searchTerm && (
                  <p className="text-sm text-gray-400 mt-1">
                    {t.cms.imagePicker.noImages}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const HistoryPageTab: React.FC = () => {
  const { getContent, updateContent, isLoading, error } = useCMS();
  const { locale, t } = useLanguage();
  const [content, setContent] = useState({
    'history-p1': '',
    'history-p2': '',
    'history-p3': '',
    'history-p4': '',
    'history-image-caption': '',
    'achievements-title': '',
    'achievements-list': [],
    'directors-title': '',
    'directors-list': [],
    'history-main-image': ''
  });
  
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Memoize content to prevent infinite loops
  const loadedContent = useMemo(() => {
    if (!t.historyPage) return {};
    
    return {
      'history-p1': getContent(`history-p1_${locale}`, t.historyPage.p1 || ''),
      'history-p2': getContent(`history-p2_${locale}`, t.historyPage.p2 || ''),
      'history-p3': getContent(`history-p3_${locale}`, t.historyPage.p3 || ''),
      'history-p4': getContent(`history-p4_${locale}`, t.historyPage.p4 || ''),
      'history-image-caption': getContent(`history-image-caption_${locale}`, t.historyPage.imageCaption || ''),
      'achievements-title': getContent(`achievements-title_${locale}`, t.historyPage.achievements?.title || ''),
      'achievements-list': getContent(`achievements-list_${locale}`, [
        t.historyPage.achievements?.list?.[0] || '',
        t.historyPage.achievements?.list?.[1] || '',
        t.historyPage.achievements?.list?.[2] || '',
        t.historyPage.achievements?.list?.[3] || '',
        t.historyPage.achievements?.list?.[4] || ''
      ].filter(Boolean)),
      'directors-title': getContent(`directors-title_${locale}`, t.historyPage.directors?.title || ''),
      'directors-list': getContent(`directors-list_${locale}`, [
        t.historyPage.directors?.list?.[0] || '',
        t.historyPage.directors?.list?.[1] || '',
        t.historyPage.directors?.list?.[2] || ''
      ].filter(Boolean)),
      'history-main-image': '' // Will be loaded separately from images table
    };
  }, [locale, t.historyPage, getContent]);

  useEffect(() => {
    if (Object.keys(loadedContent).length > 0) {
      setContent(loadedContent);
    }
  }, [loadedContent]);

  // Load image separately from images table
  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageData = await apiService.getImage('history-main-image');
        if (imageData && imageData.url) {
          console.log('🖼️ Loaded history main image:', imageData.url);
          setContent(prev => ({ ...prev, 'history-main-image': imageData.url }));
          setImagePreview(imageData.url);
          setImageUrl(imageData.url);
        } else {
          const defaultImage = 'https://picsum.photos/1200/400?random=10';
          setContent(prev => ({ ...prev, 'history-main-image': defaultImage }));
          setImagePreview(defaultImage);
          setImageUrl(defaultImage);
        }
      } catch (error) {
        console.log('⚠️ Failed to load history main image, using default');
        const defaultImage = 'https://picsum.photos/1200/400?random=10';
        setContent(prev => ({ ...prev, 'history-main-image': defaultImage }));
        setImagePreview(defaultImage);
        setImageUrl(defaultImage);
      }
    };

    loadImage();
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (imageUrl: string, filename: string) => {
    setContent(prev => ({
      ...prev,
      'history-main-image': imageUrl
    }));
    setShowImagePicker(false);
  };

  const handleSave = async (field: string) => {
    try {
      const valueToSave = content[field];
      
      if (field === 'history-main-image') {
        // Handle image using the images API
        const urlParts = (valueToSave as string).split('/');
        const filename = urlParts[urlParts.length - 1] || 'history-image.jpg';
        
        await apiService.setImageMapping(field, {
          filename: filename,
          url: valueToSave as string,
          alt_text: 'History main image',
          page_id: 'school-history',
          description: 'Main image for school history page'
        });
      } else {
        // Handle regular content
        let type = 'text';
        const saveId = Array.isArray(valueToSave) ? `${field}_${locale}` : `${field}_${locale}`;
        
        if (Array.isArray(valueToSave)) {
          type = 'list';
        }
        
        await updateContent(saveId, valueToSave, type, `${field} (${locale})`, 'school-history');
      }
      
      alert(`${field} saved successfully!`);
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    }
  };

  const handleArrayAdd = (field: string) => {
    setContent(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setContent(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleArrayItemChange = (field: string, index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          History Page Content ({locale.toUpperCase()})
        </h3>
        <p className="text-sm text-blue-700">
          Manage the content for the school history page. Changes are saved individually.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Main Image Section */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">Main Image</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Current Image
          </label>
          <div className="border rounded-lg p-2 bg-gray-50">
            <img 
              src={content['history-main-image'] || 'https://picsum.photos/1200/400?random=10'} 
              alt="History main" 
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = 'https://picsum.photos/1200/400?random=10';
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Image
            </label>
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="w-full p-3 border border-gray-300 rounded-md text-left hover:bg-gray-50 transition-colors"
            >
              📁 Choose from Pictures Folder
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Select an image from the Pictures folder. Upload images in the Media Manager tab first.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSave('history-main-image')}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Image'}
        </button>
      </div>

      {/* History Paragraphs */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">History Content</h4>
        
        {['history-p1', 'history-p2', 'history-p3', 'history-p4'].map((field, index) => (
          <div key={field} className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Paragraph {index + 1}
            </label>
            <textarea
              value={content[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder={`Enter paragraph ${index + 1} content...`}
            />
            <button
              onClick={() => handleSave(field)}
              disabled={isLoading}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        ))}
      </div>

      {/* Image Caption */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">Image Caption</h4>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Main Image Caption
          </label>
          <input
            type="text"
            value={content['history-image-caption']}
            onChange={(e) => handleInputChange('history-image-caption', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter image caption..."
          />
          <button
            onClick={() => handleSave('history-image-caption')}
            disabled={isLoading}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Section Titles */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">Section Titles</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Achievements Section Title
            </label>
            <input
              type="text"
              value={content['achievements-title']}
              onChange={(e) => handleInputChange('achievements-title', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter achievements section title..."
            />
            <button
              onClick={() => handleSave('achievements-title')}
              disabled={isLoading}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* Database-driven Achievements Section */}
          <AchievementsDirectorsManager />
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Directors Section Title
            </label>
            <input
              type="text"
              value={content['directors-title']}
              onChange={(e) => handleInputChange('directors-title', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter directors section title..."
            />
            <button
              onClick={() => handleSave('directors-title')}
              disabled={isLoading}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
          
        </div>
      </div>

      {/* Preview Link */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">👀 Preview Changes</h4>
        <a
          href="/school/history"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          View History Page
        </a>
      </div>


      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          onImageSelect={handleImageSelect}
          currentImage={content['history-main-image']}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
};

const SchoolTeamTab: React.FC = () => {
  const { t } = useLanguage();
  const { 
    getSchoolStaff, 
    createSchoolStaffMember, 
    updateSchoolStaffMember, 
    deleteSchoolStaffMember, 
    updateSchoolStaff,
    isLoading, 
    error 
  } = useCMS();
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [staffImages, setStaffImages] = useState<{[key: string]: any}>({});
  const [showTeamPhotoManager, setShowTeamPhotoManager] = useState(false);
  const [teamGroupPhoto, setTeamGroupPhoto] = useState<string | null>(null);

  useEffect(() => {
    const staff = getSchoolStaff();
    setStaffMembers(staff.sort((a, b) => (a.position || 0) - (b.position || 0)));
    
    // Load staff images
    loadStaffImages(staff);
    
    // Load current team group photo
    loadTeamGroupPhoto();
  }, [getSchoolStaff]);

  const loadTeamGroupPhoto = async () => {
    try {
      const response = await apiService.getImage('team-group-photo');
      if (response && response.url) {
        setTeamGroupPhoto(response.url);
      }
    } catch (error) {
      console.log('No team group photo set yet');
    }
  };

  const loadStaffImages = async (staff: any[]) => {
    const imagePromises = staff.map(async (member) => {
      try {
        const imageData = await apiService.getStaffImage(member.id);
        return { staffId: member.id, imageData };
      } catch (error) {
        // No image found for this staff member
        return { staffId: member.id, imageData: null };
      }
    });

    const results = await Promise.all(imagePromises);
    const imageMap: {[key: string]: any} = {};
    
    results.forEach(({ staffId, imageData }) => {
      imageMap[staffId] = imageData;
    });
    
    setStaffImages(imageMap);
    console.log('📸 Loaded staff images:', imageMap);
  };

  const handleAddMember = () => {
    const newMember = {
      id: `staff-${Date.now()}`,
      name: '',
      role: '',
      email: '',
      phone: '',
      bio: '',
      image_url: '',
      is_director: false,
      is_active: true,
      position: staffMembers.length
    };
    setEditingMember(newMember);
    setShowAddForm(true);
  };

  const handleEditMember = (member: any) => {
    setEditingMember({ ...member });
    setShowAddForm(true);
  };

  const handleSaveMember = async () => {
    if (!editingMember) return;

    try {
      const existingMember = staffMembers.find(m => m.id === editingMember.id);
      
      if (existingMember) {
        // Update existing member
        await updateSchoolStaffMember(editingMember.id, editingMember);
      } else {
        // Create new member
        await createSchoolStaffMember(editingMember);
      }
      
      // Refresh local state
      const updatedStaff = getSchoolStaff();
      setStaffMembers(updatedStaff.sort((a, b) => (a.position || 0) - (b.position || 0)));
      
      setShowAddForm(false);
      setEditingMember(null);
      alert(t.cms.schoolTeam.memberSaved);
    } catch (error) {
      console.error('Failed to save team member:', error);
      alert('Failed to save team member. Please try again.');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    const confirmed = await confirm({
      title: 'Delete Team Member',
      message: 'Are you sure you want to delete this team member?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true
    });

    if (!confirmed) return;

    try {
      await deleteSchoolStaffMember(memberId);
      
      // Refresh local state
      const updatedStaff = getSchoolStaff();
      setStaffMembers(updatedStaff.sort((a, b) => (a.position || 0) - (b.position || 0)));
      
      alert('Team member deleted successfully!');
    } catch (error) {
      console.error('Failed to delete team member:', error);
      alert('Failed to delete team member. Please try again.');
    }
  };

  const handleImageSelect = async (imageUrl: string, filename: string) => {
    if (editingMember) {
      // Save the staff image to the database
      try {
        await apiService.setStaffImage(editingMember.id, {
          image_filename: filename,
          image_url: imageUrl,
          alt_text: `Profile image for ${editingMember.name || 'staff member'}`
        });

        // Update the staff images state
        setStaffImages(prev => ({
          ...prev,
          [editingMember.id]: {
            image_filename: filename,
            image_url: imageUrl,
            alt_text: `Profile image for ${editingMember.name || 'staff member'}`
          }
        }));

        console.log('✅ Staff profile image saved:', filename);
      } catch (error) {
        console.error('❌ Failed to save staff image:', error);
        alert(`Failed to save profile image: ${error.message || 'Please try again.'}`);
      }
    }
    setShowImagePicker(false);
  };

  const handleTeamPhotoSelect = async (imageUrl: string, filename: string) => {
    try {
      // Save the team group photo using the image mapping system
      await apiService.setImageMapping('team-group-photo', {
        filename: filename,
        original_name: filename,
        url: imageUrl,
        alt_text: 'Team group photo'
      });
      
      // Update local state
      setTeamGroupPhoto(imageUrl);
      
      console.log('✅ Team group photo saved:', filename);
      alert(t.cms.schoolTeam.teamPhoto.photoUpdated);
    } catch (error) {
      console.error('❌ Failed to save team photo:', error);
      alert(`Failed to save team photo: ${error.message || 'Please try again.'}`);
    }
    setShowTeamPhotoManager(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          {t.cms.schoolTeam.title}
        </h3>
        <p className="text-sm text-blue-700">
          {t.cms.schoolTeam.description}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Team Photo Management */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-purple-800 mb-1">🏫 {t.cms.schoolTeam.teamPhoto.title}</h4>
            <p className="text-sm text-purple-600">{t.cms.schoolTeam.teamPhoto.description}</p>
          </div>
          <button
            onClick={() => setShowTeamPhotoManager(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
{t.cms.schoolTeam.teamPhoto.managePhoto}
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden max-w-md">
            {teamGroupPhoto ? (
              <img 
                src={teamGroupPhoto}
                alt="Current team group photo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">{t.cms.schoolTeam.teamPhoto.noPhotoSet}</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {t.cms.schoolTeam.teamPhoto.currentPhoto}: {teamGroupPhoto ? teamGroupPhoto.split('/').pop() || 'Unknown' : t.cms.schoolTeam.teamPhoto.noPhotoSet}
          </p>
        </div>
      </div>

      {/* Add New Member Button */}
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold text-gray-800">{t.cms.schoolTeam.membersCount.replace('{count}', staffMembers.length.toString())}</h4>
        <button
          onClick={handleAddMember}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
{t.cms.schoolTeam.addMember}
        </button>
      </div>

      {/* Team Members List */}
      <div className="grid gap-4">
        {staffMembers.map((member) => (
          <div key={member.id} className="bg-white border rounded-lg p-4 flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              {staffImages[member.id] ? (
                <img 
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${staffImages[member.id].image_url}`}
                  alt={staffImages[member.id].alt_text || member.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/64x64/cccccc/666666?text=' + (member.name?.charAt(0) || '?');
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {member.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                    {member.name || 'Unnamed'}
                    {member.is_director && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                        Director
                      </span>
                    )}
                    {!member.is_active && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                        Inactive
                      </span>
                    )}
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">{member.role || 'No role specified'}</p>
                  {member.email && (
                    <p className="text-sm text-gray-500 mt-1">📧 {member.email}</p>
                  )}
                  {member.phone && (
                    <p className="text-sm text-gray-500">📞 {member.phone}</p>
                  )}
                  {member.bio && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{member.bio}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Pos: {member.position || 0}
                  </span>
                  <button
                    onClick={() => handleEditMember(member)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {staffMembers.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.196M17 20v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2a3 3 0 003 3h6a3 3 0 003-3zM13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first team member.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Member Modal */}
      {showAddForm && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {staffMembers.find(m => m.id === editingMember.id) ? t.cms.schoolTeam.editMember : t.cms.schoolTeam.addMember}
            </h3>
            
            <div className="space-y-4">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{t.cms.schoolTeam.profileImage}</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    {staffImages[editingMember.id] ? (
                      <img 
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${staffImages[editingMember.id].image_url}`}
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                        {editingMember.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(true)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
📁 {t.cms.schoolTeam.chooseFromPictures}
                    </button>
                    {staffImages[editingMember.id] && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await apiService.deleteStaffImage(editingMember.id);
                            setStaffImages(prev => {
                              const newImages = { ...prev };
                              delete newImages[editingMember.id];
                              return newImages;
                            });
                            alert('Profile image removed successfully!');
                          } catch (error) {
                            console.error('Failed to delete staff image:', error);
                            alert('Failed to remove profile image.');
                          }
                        }}
                        className="block px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    📏 Profile Pictures need to be 300×300 pixels (square)
                  </p>
                  <p className="text-xs text-blue-600">
                    Select an image from the Pictures folder. Upload images in the Media Manager tab first.
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role/Position *</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Principal, Math Teacher, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@school.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bio/Description</label>
                <textarea
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Brief description or bio..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Position Order</label>
                  <input
                    type="number"
                    value={editingMember.position || 0}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_director"
                      checked={editingMember.is_director || false}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, is_director: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="is_director" className="text-sm text-gray-600">Is Director</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={editingMember.is_active !== false}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-600">Active</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingMember(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                disabled={isLoading || !editingMember.name || !editingMember.role}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Photo Manager Modal */}
      {showTeamPhotoManager && (
        <ImagePicker
          onImageSelect={handleTeamPhotoSelect}
          currentImage={teamGroupPhoto}
          onClose={() => setShowTeamPhotoManager(false)}
        />
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          onImageSelect={handleImageSelect}
          currentImage={staffImages[editingMember?.id]?.image_url}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
};

const PublicCouncilTab: React.FC = () => {
  const { getContent, updateContent, isLoading, error } = useCMS();
  const { locale, t } = useLanguage();
  const [content, setContent] = useState({
    'council-intro': '',
    'council-functions-title': '',
    'council-functions': [],
    'council-members-title': '',
    'council-chairman-role': '',
    'council-chairman-name': '',
    'council-members-role': '',
    'council-members-list': [],
    'council-contact': ''
  });

  // Memoize content to prevent infinite loops
  const loadedContent = useMemo(() => {
    if (!t.councilPage) return {};
    
    return {
      'council-intro': getContent(`council-intro_${locale}`, t.councilPage.intro || ''),
      'council-functions-title': getContent(`council-functions-title_${locale}`, t.councilPage.functionsTitle || ''),
      'council-functions': getContent(`council-functions_${locale}`, [
        t.councilPage.functions?.f1 || '',
        t.councilPage.functions?.f2 || '',
        t.councilPage.functions?.f3 || '',
        t.councilPage.functions?.f4 || '',
        t.councilPage.functions?.f5 || ''
      ].filter(Boolean)),
      'council-members-title': getContent(`council-members-title_${locale}`, t.councilPage.membersTitle || ''),
      'council-chairman-role': getContent(`council-chairman-role_${locale}`, t.councilPage.members?.m1?.role || ''),
      'council-chairman-name': getContent(`council-chairman-name_${locale}`, t.councilPage.members?.m1?.name || ''),
      'council-members-role': getContent(`council-members-role_${locale}`, t.councilPage.members?.m2?.role || ''),
      'council-members-list': getContent(`council-members-list_${locale}`, [
        t.councilPage.members?.m2?.names?.n1 || '',
        t.councilPage.members?.m2?.names?.n2 || '',
        t.councilPage.members?.m2?.names?.n3 || '',
        t.councilPage.members?.m2?.names?.n4 || ''
      ].filter(Boolean)),
      'council-contact': getContent(`council-contact_${locale}`, t.councilPage.contact || '')
    };
  }, [locale, t.councilPage, getContent]);

  useEffect(() => {
    if (Object.keys(loadedContent).length > 0) {
      setContent(loadedContent);
    }
  }, [loadedContent]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (field: string) => {
    try {
      const valueToSave = content[field];
      const type = Array.isArray(valueToSave) ? 'list' : 'text';
      await updateContent(`${field}_${locale}`, valueToSave, type, `${field} (${locale})`, 'school-council');
      alert(`${field} saved successfully!`);
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    }
  };

  const handleArrayAdd = (field: string) => {
    setContent(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setContent(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleArrayItemChange = (field: string, index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Public Council Page Content ({locale.toUpperCase()})
        </h3>
        <p className="text-sm text-blue-700">
          Manage the content for the public council page. Changes are saved individually.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Introduction */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">Introduction</h4>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Introduction Text
          </label>
          <textarea
            value={content['council-intro']}
            onChange={(e) => handleInputChange('council-intro', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter introduction text..."
          />
          <button
            onClick={() => handleSave('council-intro')}
            disabled={isLoading}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Functions Section */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">Functions Section</h4>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Functions Section Title
          </label>
          <input
            type="text"
            value={content['council-functions-title']}
            onChange={(e) => handleInputChange('council-functions-title', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter functions section title..."
          />
          <button
            onClick={() => handleSave('council-functions-title')}
            disabled={isLoading}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Functions List
          </label>
          {(content['council-functions'] as string[]).map((func, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={func}
                onChange={(e) => handleArrayItemChange('council-functions', index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Function ${index + 1}...`}
              />
              <button
                onClick={() => handleArrayRemove('council-functions', index)}
                className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleArrayAdd('council-functions')}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Add Function
            </button>
            <button
              onClick={() => handleSave('council-functions')}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Functions'}
            </button>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">Members Section</h4>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Members Section Title
          </label>
          <input
            type="text"
            value={content['council-members-title']}
            onChange={(e) => handleInputChange('council-members-title', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter members section title..."
          />
          <button
            onClick={() => handleSave('council-members-title')}
            disabled={isLoading}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Chairman Role
            </label>
            <input
              type="text"
              value={content['council-chairman-role']}
              onChange={(e) => handleInputChange('council-chairman-role', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Chairman role title..."
            />
            <button
              onClick={() => handleSave('council-chairman-role')}
              disabled={isLoading}
              className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Chairman Name
            </label>
            <input
              type="text"
              value={content['council-chairman-name']}
              onChange={(e) => handleInputChange('council-chairman-name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Chairman name..."
            />
            <button
              onClick={() => handleSave('council-chairman-name')}
              disabled={isLoading}
              className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Members Role Title
          </label>
          <input
            type="text"
            value={content['council-members-role']}
            onChange={(e) => handleInputChange('council-members-role', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Members role title..."
          />
          <button
            onClick={() => handleSave('council-members-role')}
            disabled={isLoading}
            className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Council Members List
          </label>
          {(content['council-members-list'] as string[]).map((member, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={member}
                onChange={(e) => handleArrayItemChange('council-members-list', index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Member ${index + 1} name...`}
              />
              <button
                onClick={() => handleArrayRemove('council-members-list', index)}
                className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleArrayAdd('council-members-list')}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Add Member
            </button>
            <button
              onClick={() => handleSave('council-members-list')}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Members'}
            </button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">Contact Information</h4>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Contact Text
          </label>
          <textarea
            value={content['council-contact']}
            onChange={(e) => handleInputChange('council-contact', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter contact information..."
          />
          <button
            onClick={() => handleSave('council-contact')}
            disabled={isLoading}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Preview Link */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">👀 Preview Changes</h4>
        <a
          href="/school/council"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          View Council Page
        </a>
      </div>
    </div>
  );
};

const MediaManagerTab: React.FC = () => {
  const { t } = useLanguage();
  const { isLoading, error } = useCMS();
  const [picturesImages, setPicturesImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Load images from Pictures folder
  useEffect(() => {
    loadPicturesImages();
  }, []);

  const loadPicturesImages = async () => {
    try {
      setIsLoadingImages(true);
      const response = await apiService.getPicturesImages();
      console.log('📁 Loaded Pictures folder images:', response);
      setPicturesImages(response.images || []);
    } catch (error) {
      console.error('❌ Failed to load Pictures folder images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => 
        apiService.uploadImageToPictures(file)
      );
      
      const results = await Promise.all(uploadPromises);
      console.log('✅ Upload results:', results);
      
      // Reload the images list
      await loadPicturesImages();
      
      alert(`Successfully uploaded ${results.length} image(s) to Pictures folder!`);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert(`Upload failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (filename: string) => {
    const confirmed = await confirm({
      title: 'Delete Image',
      message: `Are you sure you want to delete "${filename}" from the Pictures folder? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true
    });

    if (!confirmed) {
      return;
    }

    try {
      await apiService.deletePictureImage(filename);
      setPicturesImages(prev => prev.filter(img => img.filename !== filename));
    } catch (error) {
      console.error('❌ Failed to delete image:', error);
      alert(`Failed to delete image: ${error.message || 'Please try again.'}`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          📁 {t.cms.mediaManager.title}
        </h3>
        <p className="text-sm text-blue-700">
          {t.cms.mediaManager.description}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">{t.cms.mediaManager.uploadTitle}</h4>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files);
              }
            }}
            disabled={isUploading}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <p className="text-lg text-gray-600">
                {isUploading ? t.cms.mediaManager.uploading : t.cms.mediaManager.uploadText}
              </p>
              <p className="text-sm text-gray-500">
                {t.cms.mediaManager.uploadSupports}
              </p>
            </div>
          </label>
        </div>

        {/* Image Size Guidelines */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="text-sm font-semibold text-yellow-800 mb-2">📏 {t.cms.mediaManager.sizeGuidelines}</h5>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>{t.cms.mediaManager.profilePictures}</li>
            <li>{t.cms.mediaManager.galleryImages}</li>
            <li>{t.cms.mediaManager.bannerImages}</li>
            <li>{t.cms.mediaManager.general}</li>
          </ul>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-700">
            {t.cms.mediaManager.picturesFolder.replace('{count}', picturesImages.length.toString())}
          </h4>
          <button
            onClick={loadPicturesImages}
            disabled={isLoadingImages}
            className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
          >
            🔄 {t.cms.mediaManager.refresh}
          </button>
        </div>

        {isLoadingImages ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">{t.cms.mediaManager.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {picturesImages.map((image) => (
              <div key={image.filename} className="bg-gray-50 border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square mb-3 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${image.url}`}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x300/cccccc/666666?text=Error';
                    }}
                  />
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700 truncate" title={image.filename}>
                    {image.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(image.size)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(image.modified)}
                  </p>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <button
                      onClick={() => navigator.clipboard.writeText(image.url)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title={t.cms.mediaManager.copyUrl}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.filename)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title={t.cms.mediaManager.deleteImage}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {picturesImages.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t.cms.mediaManager.noImages}</h3>
                <p className="mt-1 text-sm text-gray-500">{t.cms.mediaManager.uploadStart}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DocumentManagerTab: React.FC = () => {
  const { t } = useLanguage();
  const { isLoading, error } = useCMS();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Load documents from Documents folder
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoadingDocuments(true);
      const response = await apiService.getDocuments();
      setDocuments(response.documents || []);
    } catch (error) {
      console.error('❌ Failed to load Documents folder:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    let successCount = 0;
    let errorCount = 0;

    setIsUploading(true);

    for (const file of fileArray) {
      try {
        console.log(`📄 Uploading document: ${file.name}, size: ${file.size}, type: ${file.type}`);
        const result = await apiService.uploadDocument(file);
        console.log('✅ Document uploaded successfully:', result);
        successCount++;
      } catch (error) {
        console.error('❌ Failed to upload document:', error);
        errorCount++;
        alert(`Failed to upload ${file.name}: ${error.message || 'Please try again.'}`);
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      alert(t.cms.documentManager.uploadSuccess.replace('{count}', successCount.toString()));
      loadDocuments();
    }

    if (errorCount > 0) {
      console.log(`⚠️ Upload completed with ${errorCount} errors out of ${fileArray.length} files`);
    }
  };

  const handleDeleteDocument = async (filename: string) => {
    const confirmed = await confirm({
      title: 'Delete Document',
      message: t.cms.documentManager.deleteConfirm.replace('{filename}', filename),
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true
    });

    if (!confirmed) {
      return;
    }

    try {
      await apiService.deleteDocument(filename);
      alert(t.cms.documentManager.deleteSuccess);
      loadDocuments();
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      alert(t.cms.documentManager.deleteFailed.replace('{error}', error.message || 'Unknown error'));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDocumentIcon = (type: string): string => {
    switch (type) {
      case 'pdf': return '📄';
      case 'word': return '📝';
      case 'excel': return '📊';
      case 'powerpoint': return '📊';
      case 'text': return '📃';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          📄 {t.cms.documentManager.title}
        </h3>
        <p className="text-sm text-blue-700">
          {t.cms.documentManager.description}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">{t.cms.documentManager.uploadTitle}</h4>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files);
              }
            }}
            disabled={isUploading}
            className="hidden"
            id="document-upload"
          />
          <label
            htmlFor="document-upload"
            className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <p className="text-lg text-gray-600">
                {isUploading ? t.cms.documentManager.uploading : t.cms.documentManager.uploadText}
              </p>
              <p className="text-sm text-gray-500">
                {t.cms.documentManager.uploadSupports}
              </p>
            </div>
          </label>
        </div>

        {/* Document Size Guidelines */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="text-sm font-semibold text-yellow-800 mb-2">📏 {t.cms.documentManager.sizeGuidelines}</h5>
          <ul className="text-xs text-yellow-700 space-y-1">
            {t.cms.documentManager.documentGuidelines.map((guideline, index) => (
              <li key={index}>{guideline}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-700">
            {t.cms.documentManager.documentsFolder.replace('{count}', documents.length.toString())}
          </h4>
          <button
            onClick={loadDocuments}
            disabled={isLoadingDocuments}
            className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
          >
            🔄 {t.cms.documentManager.refresh}
          </button>
        </div>

        {isLoadingDocuments ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">{t.cms.documentManager.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {documents.map((document) => (
              <div key={document.filename} className="bg-gray-50 border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="text-4xl mr-3">
                    {getDocumentIcon(document.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate" title={document.filename}>
                      {document.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t.cms.documentManager.documentTypes[document.type] || t.cms.documentManager.documentTypes.other}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>{formatFileSize(document.size)}</p>
                  <p>{formatDate(document.modified)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${document.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title={t.cms.documentManager.openDocument}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button
                    onClick={() => {
                      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${document.url}`;
                      navigator.clipboard.writeText(url);
                      alert('URL copied to clipboard!');
                    }}
                    className="text-gray-600 hover:text-gray-800 p-1"
                    title={t.cms.documentManager.copyUrl}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(document.filename)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title={t.cms.documentManager.deleteDocument}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t.cms.documentManager.noDocuments}</h3>
                <p className="mt-1 text-sm text-gray-500">{t.cms.documentManager.uploadStart}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PowerPointManagerTab: React.FC = () => {
  const { t } = useLanguage();
  const { isLoading, error } = useCMS();
  const [presentations, setPresentations] = useState<any[]>([]);
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Load presentations from Presentations folder
  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setIsLoadingPresentations(true);
      const response = await apiService.getPresentations();
      setPresentations(response.presentations || []);
    } catch (error) {
      console.error('❌ Failed to load Presentations folder:', error);
    } finally {
      setIsLoadingPresentations(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    let successCount = 0;
    let errorCount = 0;

    setIsUploading(true);

    for (const file of fileArray) {
      // Check if file is a PowerPoint presentation
      const isPowerPoint = file.type === 'application/vnd.ms-powerpoint' || 
                          file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                          file.name.toLowerCase().endsWith('.ppt') ||
                          file.name.toLowerCase().endsWith('.pptx');

      if (!isPowerPoint) {
        alert(`${file.name} is not a valid PowerPoint presentation file. Only .ppt and .pptx files are allowed.`);
        errorCount++;
        continue;
      }

      try {
        console.log(`📊 Uploading presentation: ${file.name}, size: ${file.size}, type: ${file.type}`);
        const result = await apiService.uploadPresentation(file);
        console.log('✅ Presentation uploaded successfully:', result);
        successCount++;
      } catch (error) {
        console.error('❌ Failed to upload presentation:', error);
        errorCount++;
        alert(`Failed to upload ${file.name}: ${error.message || 'Please try again.'}`);
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      alert(`${successCount} presentation(s) uploaded successfully!`);
      loadPresentations();
    }

    if (errorCount > 0) {
      console.log(`⚠️ Upload completed with ${errorCount} errors out of ${fileArray.length} files`);
    }
  };

  const handleDeletePresentation = async (filename: string) => {
    const confirmed = await confirm({
      title: 'Delete Presentation',
      message: `Are you sure you want to delete the presentation "${filename}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true
    });

    if (!confirmed) {
      return;
    }

    try {
      await apiService.deletePresentation(filename);
      alert('Presentation deleted successfully!');
      loadPresentations();
    } catch (error) {
      console.error('❌ Failed to delete presentation:', error);
      alert(`Failed to delete presentation: ${error.message || 'Unknown error'}`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">
          📊 PowerPoint Presentation Manager
        </h3>
        <p className="text-sm text-orange-700">
          Upload and manage PowerPoint presentations. Only .ppt and .pptx files are supported.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">Upload Presentations</h4>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files);
              }
            }}
            disabled={isUploading}
            className="hidden"
            id="presentation-upload"
          />
          <label
            htmlFor="presentation-upload"
            className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <p className="text-lg text-gray-600">
                {isUploading ? 'Uploading...' : 'Click to upload PowerPoint presentations'}
              </p>
              <p className="text-sm text-gray-500">
                Supports .ppt and .pptx files
              </p>
            </div>
          </label>
        </div>

        <div className="mt-4">
          <h5 className="text-sm font-semibold mb-2 text-gray-700">File Guidelines:</h5>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>PowerPoint Presentations: Only .ppt and .pptx files are accepted</li>
            <li>File Size: Keep files under 50MB for optimal performance</li>
            <li>Content: Ensure presentations are appropriate for school use</li>
          </ul>
        </div>
      </div>

      {/* Presentations List */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-md font-semibold mb-4 text-gray-700">
          📊 Presentations Folder ({presentations.length} presentations)
        </h4>
        
        {isLoadingPresentations ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading presentations...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presentations.map((presentation, index) => (
              <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">📊</span>
                      <h5 className="text-sm font-medium text-gray-900 truncate" title={presentation.filename}>
                        {presentation.filename}
                      </h5>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Size: {formatFileSize(presentation.size || 0)}</div>
                      <div>Modified: {formatDate(presentation.lastModified || presentation.dateModified || new Date().toISOString())}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/presentations/${encodeURIComponent(presentation.filename)}`, '_blank')}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Download presentation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePresentation(presentation.filename)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete presentation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            {presentations.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No presentations uploaded</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading your first PowerPoint presentation.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const NewsManagerTab: React.FC = () => {
  const { t, getTranslation } = useLanguage();
  const { isLoading, error } = useCMS();
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title_bg: '',
    title_en: '',
    excerpt_bg: '',
    excerpt_en: '',
    content_bg: '',
    content_en: '',
    featured_image_url: '',
    featured_image_alt: '',
    is_published: true,
    is_featured: false,
    published_date: new Date().toISOString().split('T')[0]
  });

  // Load news articles
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setIsLoadingNews(true);
      const articles = await apiService.getAllNewsForAdmin();
      setNewsArticles(articles || []);
    } catch (error) {
      console.error('❌ Failed to load news articles:', error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleAddNews = () => {
    setFormData({
      title_bg: '',
      title_en: '',
      excerpt_bg: '',
      excerpt_en: '',
      content_bg: '',
      content_en: '',
      featured_image_url: '',
      featured_image_alt: '',
      is_published: true,
      is_featured: false,
      published_date: new Date().toISOString().split('T')[0]
    });
    setEditingArticle(null);
    setShowAddForm(true);
  };

  const handleEditNews = (article: any) => {
    setFormData({
      title_bg: article.title_bg || '',
      title_en: article.title_en || '',
      excerpt_bg: article.excerpt_bg || '',
      excerpt_en: article.excerpt_en || '',
      content_bg: article.content_bg || '',
      content_en: article.content_en || '',
      featured_image_url: article.featured_image_url || '',
      featured_image_alt: article.featured_image_alt || '',
      is_published: Boolean(article.is_published),
      is_featured: Boolean(article.is_featured),
      published_date: article.published_date ? article.published_date.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setEditingArticle(article);
    setShowAddForm(true);
  };

  const handleSaveNews = async () => {
    // Validation
    if (!formData.title_bg || !formData.title_en || !formData.excerpt_bg || !formData.excerpt_en) {
      alert(getTranslation("cms.newsManager.form.requiredFields", "Please fill in all required fields"));
      return;
    }

    try {
      const articleData = {
        ...formData,
        published_date: formData.published_date + 'T00:00:00.000Z'
      };

      if (editingArticle) {
        await apiService.updateNewsArticle(editingArticle.id, articleData);
        alert(getTranslation("cms.newsManager.messages.updateSuccess", "News article updated successfully"));
      } else {
        await apiService.createNewsArticle(articleData);
        alert(getTranslation("cms.newsManager.messages.createSuccess", "News article created successfully"));
      }

      setShowAddForm(false);
      loadNews();
    } catch (error) {
      console.error('❌ Failed to save news article:', error);
      const errorMsg = editingArticle ? 
        getTranslation('cms.newsManager.messages.updateError', 'Failed to update news article: {error}').replace('{error}', error.message || 'Unknown error') :
        getTranslation('cms.newsManager.messages.createError', 'Failed to create news article: {error}').replace('{error}', error.message || 'Unknown error');
      alert(errorMsg);
    }
  };

  const handleDeleteNews = async (article: any) => {
    const confirmed = await confirm({
      title: 'Delete News Article',
      message: getTranslation("cms.newsManager.messages.deleteConfirm", "Are you sure you want to delete this news article?"),
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true
    });

    if (!confirmed) {
      return;
    }

    try {
      await apiService.deleteNewsArticle(article.id);
      alert(getTranslation("cms.newsManager.messages.deleteSuccess", "News article deleted successfully"));
      loadNews();
    } catch (error) {
      console.error('❌ Failed to delete news article:', error);
      alert(getTranslation('cms.newsManager.messages.deleteError', 'Failed to delete news article: {error}').replace('{error}', error.message || 'Unknown error'));
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageSelect = (imageUrl: string, filename: string) => {
    setFormData(prev => ({
      ...prev,
      featured_image_url: imageUrl,
      featured_image_alt: filename
    }));
    setShowImagePicker(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          📰 {getTranslation("cms.newsManager.title", "News Manager")}
        </h3>
        <p className="text-sm text-blue-700">
          {getTranslation("cms.newsManager.description", "Manage news articles and announcements")}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add News Button */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800">{getTranslation("cms.newsManager.newsList", "News Articles")}</h4>
        <button
          onClick={handleAddNews}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          ➕ {getTranslation("cms.newsManager.addNews", "Add News Article")}
        </button>
      </div>

      {/* News List */}
      {isLoadingNews ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading news articles...</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg">
          {newsArticles.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 011 2v1m2 13a2 2 0 01-2-2V7m2 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v1" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{getTranslation("cms.newsManager.noNews", "No news articles")}</h3>
              <p className="mt-1 text-sm text-gray-500">{getTranslation("cms.newsManager.createFirst", "Create your first news article")}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {newsArticles.map((article) => (
                <div key={article.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="text-lg font-medium text-gray-900 truncate">
                          {article.title_bg}
                        </h5>
                        <div className="flex space-x-1">
                          {article.is_published && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {getTranslation("cms.newsManager.status.published", "Published")}
                            </span>
                          )}
                          {!article.is_published && (
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                              {getTranslation("cms.newsManager.status.draft", "Draft")}
                            </span>
                          )}
                          {article.is_featured && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              {getTranslation("cms.newsManager.status.featured", "Featured")}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{article.excerpt_bg}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(article.published_date)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEditNews(article)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title={getTranslation("cms.newsManager.actions.edit", "Edit")}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNews(article)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title={getTranslation("cms.newsManager.actions.delete", "Delete")}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingArticle ? getTranslation("cms.newsManager.editNews", "Edit News Article") : getTranslation("cms.newsManager.addNews", "Add News Article")}
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation('cms.newsManager.form.titleBg', 'Title (Bulgarian)')}
                  </label>
                  <input
                    type="text"
                    value={formData.title_bg}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_bg: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Заглавие на български"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation('cms.newsManager.form.titleEn', 'Title (English)')}
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Title in English"
                  />
                </div>
              </div>

              {/* Excerpts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation("cms.newsManager.form.excerptBg", "Excerpt (Bulgarian)")}
                  </label>
                  <textarea
                    value={formData.excerpt_bg}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt_bg: e.target.value }))}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Кратко описание на български"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation("cms.newsManager.form.excerptEn", "Excerpt (English)")}
                  </label>
                  <textarea
                    value={formData.excerpt_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Short description in English"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation("cms.newsManager.form.contentBg", "Content (Bulgarian)")}
                  </label>
                  <textarea
                    value={formData.content_bg}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_bg: e.target.value }))}
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Пълно съдържание на български"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation("cms.newsManager.form.contentEn", "Content (English)")}
                  </label>
                  <textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full content in English"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation("cms.newsManager.form.featuredImage", "Featured Image")}
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    {getTranslation("cms.newsManager.form.selectImage", "Select Image")}
                  </button>
                  {formData.featured_image_url && (
                    <>
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${formData.featured_image_url}`}
                        alt="Featured"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '', featured_image_alt: '' }))}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {getTranslation("cms.newsManager.form.removeImage", "Remove")}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation("cms.newsManager.form.publishedDate", "Published Date")}
                  </label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                      className="mr-2"
                    />
                    {getTranslation("cms.newsManager.form.isPublished", "Published")}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="mr-2"
                    />
                    {getTranslation("cms.newsManager.form.isFeatured", "Featured")}
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                {getTranslation("cms.newsManager.actions.cancel", "Cancel")}
              </button>
              <button
                onClick={handleSaveNews}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : getTranslation("cms.newsManager.actions.save", "Save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          onImageSelect={handleImageSelect}
          currentImage={formData.featured_image_url}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
};

const GalleryTab: React.FC = () => {
  const { isLoading, error } = useCMS();
  const { locale } = useLanguage();
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Load gallery images from database
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        setIsLoadingImages(true);
        const images = await apiService.getImagesByPage('gallery');
        console.log('📸 Loaded gallery images:', images);
        
        // Sort by position or created_at
        const sortedImages = images.sort((a, b) => {
          const posA = parseInt(a.id.replace('gallery-img', '')) || 0;
          const posB = parseInt(b.id.replace('gallery-img', '')) || 0;
          return posA - posB;
        });
        
        setGalleryImages(sortedImages);
      } catch (error) {
        console.error('❌ Failed to load gallery images:', error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadGalleryImages();
  }, []);

  const handleAddImage = () => {
    const nextId = `gallery-img${galleryImages.length + 1}`;
    setEditingImage({
      id: nextId,
      url: '',
      alt_text: '',
      description: '',
      filename: ''
    });
    setShowAddForm(true);
  };

  const handleEditImage = (image: any) => {
    setEditingImage({ ...image });
    setShowAddForm(true);
  };

  const handleDeleteImage = async (imageId: string) => {
    const confirmed = await confirm({
      title: 'Delete Gallery Image',
      message: 'Are you sure you want to delete this image from the gallery?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true
    });

    if (!confirmed) return;

    try {
      await apiService.deleteImageMapping(imageId);
      setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleSaveImage = async () => {
    if (!editingImage || !editingImage.url) return;

    try {
      // Check if we're adding a new image (not editing existing)
      const existingImageWithId = galleryImages.find(img => img.id === editingImage.id);
      
      if (!existingImageWithId) {
        // Check for duplicate URLs when adding new image
        const duplicateUrl = galleryImages.find(img => img.url === editingImage.url);
        if (duplicateUrl) {
          const proceed = await confirm({
            title: 'Duplicate URL',
            message: `An image with the same URL already exists in the gallery (ID: ${duplicateUrl.id}). Do you want to add it anyway as a duplicate?`,
            confirmText: 'Add Anyway',
            cancelText: 'Cancel',
            isDangerous: false
          });
          if (!proceed) {
            return;
          }
        }

        // Check for duplicate filename when adding new image
        const filename = editingImage.filename || extractFilenameFromUrl(editingImage.url);
        const duplicateFilename = galleryImages.find(img => 
          img.filename === filename || 
          img.original_name === filename
        );
        if (duplicateFilename) {
          const proceed = await confirm({
            title: 'Duplicate Filename',
            message: `An image with filename "${filename}" already exists in the gallery (ID: ${duplicateFilename.id}). Do you want to add it anyway as a duplicate?`,
            confirmText: 'Add Anyway',
            cancelText: 'Cancel',
            isDangerous: false
          });
          if (!proceed) {
            return;
          }
        }
      }

      const imageData = {
        filename: editingImage.filename || extractFilenameFromUrl(editingImage.url),
        url: editingImage.url,
        alt_text: editingImage.alt_text || 'Gallery image',
        page_id: 'gallery',
        description: editingImage.description || 'Gallery image'
      };
      
      if (existingImageWithId) {
        await apiService.updateImageMapping(editingImage.id, imageData);
        setGalleryImages(prev => 
          prev.map(img => img.id === editingImage.id ? { ...img, ...imageData } : img)
        );
      } else {
        await apiService.setImageMapping(editingImage.id, imageData);
        setGalleryImages(prev => [...prev, { id: editingImage.id, ...imageData }]);
      }

      setShowAddForm(false);
      setEditingImage(null);
      alert('Image saved successfully!');
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  const handleReorderImage = (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = galleryImages.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= galleryImages.length) return;
    
    const reorderedImages = [...galleryImages];
    [reorderedImages[currentIndex], reorderedImages[newIndex]] = [reorderedImages[newIndex], reorderedImages[currentIndex]];
    
    setGalleryImages(reorderedImages);
    
    // Optional: Save new order to backend (requires API implementation)
    // For now, we'll just handle client-side reordering
    console.log('🔄 Gallery images reordered');
  };

  const handleImageSelect = (imageUrl: string, filename: string) => {
    if (editingImage) {
      setEditingImage(prev => ({
        ...prev,
        url: imageUrl,
        filename: filename
      }));
    }
    setShowImagePicker(false);
  };

  const extractFilenameFromUrl = (url: string): string => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || 'image.jpg';
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Gallery Management
        </h3>
        <p className="text-sm text-blue-700">
          Manage gallery images. Add, edit, reorder, and delete images that appear in the photo gallery.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add New Image Button */}
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold text-gray-800">
          Gallery Images ({galleryImages.length})
        </h4>
        <button
          onClick={handleAddImage}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Gallery Image
        </button>
      </div>

      {/* Gallery Images Grid */}
      {isLoadingImages ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading gallery images...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => {
            // Check if this image is a duplicate (same URL or filename as another image)
            const isDuplicateUrl = galleryImages.some((other, otherIndex) => 
              other.url === image.url && otherIndex !== index
            );
            const isDuplicateFile = galleryImages.some((other, otherIndex) => 
              (other.filename === image.filename || other.original_name === image.filename) && 
              otherIndex !== index && image.filename
            );
            const isDuplicate = isDuplicateUrl || isDuplicateFile;
            
            return (
            <div key={image.id} className={`bg-white border rounded-lg p-3 shadow-sm ${isDuplicate ? 'border-orange-300 bg-orange-50' : ''}`}>
              <div className="aspect-square mb-3 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.alt_text || 'Gallery image'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x300/cccccc/666666?text=No+Image';
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 truncate" title={image.id}>
                    ID: {image.id}
                  </p>
                  {isDuplicate && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium" title="This image appears to be a duplicate">
                      ⚠️ Duplicate
                    </span>
                  )}
                </div>
                {image.alt_text && (
                  <p className="text-xs text-gray-500 truncate" title={image.alt_text}>
                    Alt: {image.alt_text}
                  </p>
                )}
                {image.description && (
                  <p className="text-xs text-gray-500 truncate" title={image.description}>
                    Desc: {image.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleReorderImage(image.id, 'up')}
                      disabled={index === 0}
                      className="text-gray-600 hover:text-gray-800 p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleReorderImage(image.id, 'down')}
                      disabled={index === galleryImages.length - 1}
                      className="text-gray-600 hover:text-gray-800 p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditImage(image)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
          
          {galleryImages.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No gallery images</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first gallery image.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Image Modal */}
      {showAddForm && editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {galleryImages.find(img => img.id === editingImage.id) ? 'Edit Gallery Image' : 'Add Gallery Image'}
            </h3>
            
            <div className="space-y-4">
              {/* Preview */}
              {editingImage.url && (
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={editingImage.url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Select Image from Pictures Folder */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Select Image</label>
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="w-full p-3 border border-gray-300 rounded-md text-left hover:bg-gray-50 transition-colors"
                >
                  {editingImage.url ? 
                    `📁 ${editingImage.filename || 'Selected Image'}` : 
                    '📁 Choose from Pictures Folder'
                  }
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Select an image from the Pictures folder. Upload images in the Media Manager tab first.
                </p>
              </div>

              {/* Image ID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Image ID</label>
                <input
                  type="text"
                  value={editingImage.id}
                  onChange={(e) => setEditingImage(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="gallery-img1"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Alt Text</label>
                <input
                  type="text"
                  value={editingImage.alt_text || ''}
                  onChange={(e) => setEditingImage(prev => ({ ...prev, alt_text: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Description for accessibility"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                <textarea
                  value={editingImage.description || ''}
                  onChange={(e) => setEditingImage(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md resize-vertical"
                  placeholder="Image description..."
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingImage(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
                disabled={isLoading || !editingImage.url}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          onImageSelect={handleImageSelect}
          currentImage={editingImage?.url}
          onClose={() => setShowImagePicker(false)}
        />
      )}

      {/* Preview Link */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">👀 Preview Changes</h4>
        <a
          href="/gallery"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          View Gallery Page
        </a>
      </div>
    </div>
  );
};

const CMSDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('media');
  const { isLoggedIn, logout } = useCMS();
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const { confirm, dialogProps } = useConfirm();

  // Organize tabs into categories
  const tabCategories = useMemo(() => [
    {
      id: 'uploads',
      label: 'Uploads',
      icon: '📁',
      tabs: [
        {
          id: 'media',
          label: t.cms.tabs.media,
          icon: '🖼️',
          content: <MediaManagerTab />
        },
        {
          id: 'documents',
          label: t.cms.tabs.documents,
          icon: '📄',
          content: <DocumentManagerTab />
        },
        {
          id: 'presentations',
          label: 'Presentations',
          icon: '📊',
          content: <PowerPointManagerTab />
        }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: '📝',
      tabs: [
        {
          id: 'news',
          label: t.cms.tabs.news,
          icon: '📰',
          content: <NewsManagerTab />
        },
        {
          id: 'contacts',
          label: t.cms.tabs.contacts,
          icon: '📞',
          content: <ContactManagerTab />
        },
        {
          id: 'info-access',
          label: t.cms.tabs.infoAccess,
          icon: '🔓',
          content: <InfoAccessManagerTab />
        },
        {
          id: 'history',
          label: t.cms.tabs.history,
          icon: '📚',
          content: <HistoryPageTab />
        },
        {
          id: 'gallery',
          label: t.cms.tabs.gallery,
          icon: '🎨',
          content: <GalleryTab />
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: '📅',
          content: <CalendarManagerTab />
        },
        {
          id: 'patron',
          label: 'Patron Page',
          icon: '👑',
          content: <PatronManagerTab />
        },
        {
          id: 'useful-links',
          label: 'Useful Links',
          icon: '🔗',
          content: <UsefulLinksManagerTab />
        },
        {
          id: 'documents-menu',
          label: t.cms.tabs.documentsMenu,
          icon: '📋',
          content: <DocumentsMenuManagerTab isActive={activeTab === 'documents-menu'} />
        },
        {
          id: 'projects-menu',
          label: 'Projects Menu',
          icon: '📊',
          content: <ProjectsMenuManagerTab isActive={activeTab === 'projects-menu'} />
        },
        {
          id: 'translations',
          label: 'Translations',
          icon: '🌐',
          content: <TranslationsManagerTab />
        }
      ]
    },
    {
      id: 'people',
      label: 'People',
      icon: '👥',
      tabs: [
        {
          id: 'school-team',
          label: t.cms.tabs.schoolTeam,
          icon: '👨‍🏫',
          content: <SchoolTeamTab />
        },
        {
          id: 'public-council',
          label: t.cms.tabs.publicCouncil,
          icon: '🏛️',
          content: <PublicCouncilTab />
        }
      ]
    }
  ], [t]);

  // Auto-open dropdown containing active tab
  useEffect(() => {
    const activeCategory = tabCategories.find(category => 
      category.tabs.some(tab => tab.id === activeTab)
    );
    if (activeCategory && !openDropdowns[activeCategory.id]) {
      setOpenDropdowns(prev => ({
        ...prev,
        [activeCategory.id]: true
      }));
    }
  }, [activeTab, tabCategories, openDropdowns]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">{t.cms.dashboard.accessDenied.title}</h2>
          <p className="text-red-700">{t.cms.dashboard.accessDenied.message}</p>
        </div>
      </div>
    );
  }

  // Flatten all tabs for easy lookup
  const allTabs = tabCategories.flatMap(category => category.tabs);
  
  const toggleDropdown = (categoryId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t.cms.dashboard.title}</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          {t.cms.dashboard.logout}
        </button>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>Content Management</span>
          </h2>
          
          <div className="space-y-2">
            {tabCategories.map((category) => (
              <div key={category.id} className="border border-gray-100 rounded-lg">
                {/* Category Header */}
                <button
                  onClick={() => toggleDropdown(category.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    {category.label}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openDropdowns[category.id] ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Category Tabs */}
                {openDropdowns[category.id] && (
                  <div className="px-3 pb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {category.tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 p-3 rounded-md text-left transition-colors ${
                            activeTab === tab.id
                              ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                              : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-lg">{tab.icon}</span>
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-screen">
        {activeTab === 'projects-menu' && <ProjectsMenuManagerTab isActive={true} />}
        {activeTab === 'documents-menu' && <DocumentsMenuManagerTab isActive={true} />}
        {activeTab !== 'projects-menu' && activeTab !== 'documents-menu' && allTabs.find(tab => tab.id === activeTab)?.content}
      </div>

      <ConfirmDialog {...dialogProps} />
    </div>
  );
};

export default CMSDashboard;
