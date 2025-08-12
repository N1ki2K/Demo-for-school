import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { StaffMember } from '../../context/CMSContext';
import { apiService } from '../../src/services/api';

export const StaffManagementDashboard: React.FC = () => {
  const { getStaff, updateStaff, isLoading } = useCMS();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    role: '',
    image_url: '',
    is_director: false,
    email: '',
    phone: '',
    bio: ''
  });

  useEffect(() => {
    const staffList = getStaff();
    setStaff(staffList);
  }, []);

  const handleInputChange = (field: keyof StaffMember, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    const newMember: StaffMember = {
      id: editingMember?.id || `staff-${Date.now()}`,
      name: formData.name || '',
      role: formData.role || '',
      image_url: formData.image_url || `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
      is_director: formData.is_director || false,
      email: formData.email || '',
      phone: formData.phone || '',
      bio: formData.bio || '',
      position: staff.length,
      is_active: true
    };

    let updatedStaff: StaffMember[];
    if (editingMember) {
      // Update existing member
      updatedStaff = staff.map(member => 
        member.id === editingMember.id ? newMember : member
      );
    } else {
      // Add new member
      updatedStaff = [...staff, newMember];
    }

    await updateStaff(updatedStaff);
    setStaff(updatedStaff);

    // Reset form
    setFormData({
      name: '',
      role: '',
      image_url: '',
      is_director: false,
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      try {
        // Call the API to delete the staff member
        await apiService.deleteStaffMember(id);
        
        // Update local state
        const updatedStaff = staff.filter(member => member.id !== id);
        setStaff(updatedStaff);
        
        console.log('Staff member deleted successfully');
      } catch (error) {
        console.error('Failed to delete staff member:', error);
        alert('Failed to delete staff member. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      image_url: '',
      is_director: false,
      email: '',
      phone: '',
      bio: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Staff Management</h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            + Add Staff Member
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 border">
          <h4 className="text-lg font-medium mb-4">
            {editingMember ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role *</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty for random image"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_director"
                checked={formData.is_director || false}
                onChange={(e) => handleInputChange('is_director', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_director" className="ml-2 block text-sm text-gray-900">
                Director
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (editingMember ? 'Update' : 'Add')} Staff Member
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow p-4 border">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={member.image_url || `https://picsum.photos/400/400?random=${member.id}`}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
                {member.is_director && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                    Director
                  </span>
                )}
              </div>
            </div>
            
            {(member.email || member.phone) && (
              <div className="text-sm text-gray-600 mb-3">
                {member.email && <div>📧 {member.email}</div>}
                {member.phone && <div>📞 {member.phone}</div>}
              </div>
            )}
            
            {member.bio && (
              <p className="text-sm text-gray-700 mb-3">{member.bio}</p>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {staff.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>No staff members yet. Add your first staff member to get started!</p>
        </div>
      )}
    </div>
  );
};