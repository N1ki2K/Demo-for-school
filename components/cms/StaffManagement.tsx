// components/cms/StaffManagement.tsx
import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  isDirector: boolean;
  email?: string;
  phone?: string;
  bio?: string;
}

interface StaffManagementProps {
  staffList: StaffMember[];
  onStaffUpdate: (staff: StaffMember[]) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ 
  staffList, 
  onStaffUpdate 
}) => {
  const { isEditing } = useCMS();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    role: '',
    imageUrl: '',
    isDirector: false,
    email: '',
    phone: '',
    bio: ''
  });

  if (!isEditing) return null;

  const handleInputChange = (field: keyof StaffMember, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    const newMember: StaffMember = {
      id: editingMember?.id || `staff-${Date.now()}`,
      name: formData.name || '',
      role: formData.role || '',
      imageUrl: formData.imageUrl || `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
      isDirector: Boolean(formData.isDirector),
      email: formData.email || '',
      phone: formData.phone || '',
      bio: formData.bio || ''
    };


    if (editingMember) {
      // Update existing member
      const updatedStaff = staffList.map(member => 
        member.id === editingMember.id ? newMember : member
      );
      onStaffUpdate(updatedStaff);
    } else {
      // Add new member
      onStaffUpdate([...staffList, newMember]);
    }

    // Reset form
    setFormData({
      name: '',
      role: '',
      imageUrl: '',
      isDirector: false,
      email: '',
      phone: '',
      bio: ''
    });
    setShowAddForm(false);
    setEditingMember(null);
  };

  const handleEdit = (member: StaffMember) => {
    setEditingMember(member);
    setFormData(member);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      const updatedStaff = staffList.filter(member => member.id !== id);
      onStaffUpdate(updatedStaff);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      imageUrl: '',
      isDirector: false,
      email: '',
      phone: '',
      bio: ''
    });
  };

  return (
    <div className="cms-staff-management">
      {/* Add Staff Button */}
      {!showAddForm && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Staff Member
          </button>
        </div>
      )}

      {/* Staff Management Controls */}
      {staffList.length > 0 && !showAddForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Staff Management</h3>
          <div className="grid gap-2">
            {staffList.map(member => (
              <div key={member.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="flex items-center space-x-3">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    {member.isDirector && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Director
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              {editingMember ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Role/Position *
                  </label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                    placeholder="e.g., Mathematics Teacher"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="https://example.com/photo.jpg (optional - random image will be used if empty)"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="email@school.bg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="+359 42 123 456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Biography/Description
                </label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Brief description or biography..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDirector"
                  checked={formData.isDirector || false}
                  onChange={(e) => handleInputChange('isDirector', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isDirector" className="text-sm font-medium text-gray-700">
                  Mark as Director/Principal
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  {editingMember ? 'Update Staff Member' : 'Add Staff Member'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};