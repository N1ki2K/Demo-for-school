import React, { useState, useEffect } from 'react';
import { apiService } from '../../src/services/api';
import { useCMS } from '../../context/CMSContext';

interface Achievement {
  id?: number;
  title: string;
  description?: string;
  year?: number;
  position?: number;
  is_active?: boolean;
}

interface Director {
  id?: number;
  name: string;
  tenure_start?: string;
  tenure_end?: string;
  description?: string;
  position?: number;
  is_active?: boolean;
}

const AchievementsDirectorsManager: React.FC = () => {
  const { isEditing, isLoading: cmsLoading } = useCMS();
  
  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement>({ title: '' });
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  
  // Directors state
  const [directors, setDirectors] = useState<Director[]>([]);
  const [newDirector, setNewDirector] = useState<Director>({ name: '' });
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Bulk editing state
  const [tempAchievements, setTempAchievements] = useState<Achievement[]>([]);

  // Load data on mount
  useEffect(() => {
    loadAchievements();
    loadDirectors();
  }, []);

  // ============== ACHIEVEMENTS FUNCTIONS ==============

  const loadAchievements = async () => {
    try {
      setLoading(true);
      console.log('🔄 CMS Loading achievements...');
      const data = await apiService.getAchievements();
      console.log('📊 CMS Achievements loaded:', data);
      setAchievements(data || []);
    } catch (error) {
      console.error('❌ CMS Error loading achievements:', error);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievement.title.trim()) return;
    
    try {
      setLoading(true);
      const created = await apiService.createAchievement({
        title: newAchievement.title,
        description: newAchievement.description,
        year: newAchievement.year,
        position: achievements.length
      });
      setAchievements([...achievements, created]);
      setNewAchievement({ title: '' });
    } catch (error) {
      console.error('Error adding achievement:', error);
      setError('Failed to add achievement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAchievement = async (achievement: Achievement) => {
    if (!achievement.id) return;
    
    try {
      setLoading(true);
      const updated = await apiService.updateAchievement(achievement.id, achievement);
      setAchievements(achievements.map(a => a.id === achievement.id ? updated : a));
      setEditingAchievement(null);
    } catch (error) {
      console.error('Error updating achievement:', error);
      setError('Failed to update achievement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteAchievement(id);
      setAchievements(achievements.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting achievement:', error);
      setError('Failed to delete achievement');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkEditAchievements = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsed = lines.map((line, index) => {
      const parts = line.split('|').map(part => part.trim());
      const achievement: Achievement = {
        title: parts[0] || '',
        position: index
      };
      
      if (parts[1]) achievement.description = parts[1];
      if (parts[2] && !isNaN(parseInt(parts[2]))) achievement.year = parseInt(parts[2]);
      
      return achievement;
    });
    
    setTempAchievements(parsed);
  };

  const handleSaveBulkAchievements = async () => {
    try {
      setLoading(true);
      
      // Delete all existing achievements
      for (const achievement of achievements) {
        if (achievement.id) {
          await apiService.deleteAchievement(achievement.id);
        }
      }
      
      // Create new achievements from the bulk edit
      const createdAchievements: Achievement[] = [];
      for (const [index, achievement] of tempAchievements.entries()) {
        if (achievement.title.trim()) {
          const created = await apiService.createAchievement({
            title: achievement.title,
            description: achievement.description,
            year: achievement.year,
            position: index
          });
          createdAchievements.push(created);
        }
      }
      
      setAchievements(createdAchievements);
      setTempAchievements([]);
    } catch (error) {
      console.error('Error bulk saving achievements:', error);
      setError('Failed to save achievements');
    } finally {
      setLoading(false);
    }
  };

  // ============== DIRECTORS FUNCTIONS ==============

  const loadDirectors = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDirectors();
      setDirectors(data || []);
    } catch (error) {
      console.error('Error loading directors:', error);
      setError('Failed to load directors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDirector = async () => {
    if (!newDirector.name.trim()) return;
    
    try {
      setLoading(true);
      const created = await apiService.createDirector({
        name: newDirector.name,
        tenure_start: newDirector.tenure_start,
        tenure_end: newDirector.tenure_end,
        description: newDirector.description,
        position: directors.length
      });
      setDirectors([...directors, created]);
      setNewDirector({ name: '' });
    } catch (error) {
      console.error('Error adding director:', error);
      setError('Failed to add director');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDirector = async (director: Director) => {
    if (!director.id) return;
    
    try {
      setLoading(true);
      const updated = await apiService.updateDirector(director.id, director);
      setDirectors(directors.map(d => d.id === director.id ? updated : d));
      setEditingDirector(null);
    } catch (error) {
      console.error('Error updating director:', error);
      setError('Failed to update director');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDirector = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteDirector(id);
      setDirectors(directors.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting director:', error);
      setError('Failed to delete director');
    } finally {
      setLoading(false);
    }
  };

  // Always show the component for management purposes
  // if (!isEditing) {
  //   return null;
  // }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">School History Management (Database)</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 underline text-sm mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ACHIEVEMENTS SECTION */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🏆 Achievements Management</h4>
        
        {/* View Current Achievements */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4 border">
          <h5 className="text-sm font-semibold text-blue-800 mb-3">👁️ Current Achievements ({achievements.length})</h5>
          {achievements.length > 0 ? (
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div key={achievement.id} className="flex items-center justify-between p-3 bg-white rounded border-l-4 border-blue-400">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{achievement.title}</p>
                        {achievement.description && (
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        )}
                        {achievement.year && (
                          <p className="text-xs text-blue-600">Year: {achievement.year}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAchievement(achievement)}
                      className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(achievement.id!)}
                      className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-blue-600 italic">No achievements added yet.</p>
          )}
        </div>

        {/* Bulk Edit Achievements */}
        <div className="bg-green-50 p-4 rounded-lg border">
          <h5 className="text-sm font-semibold text-green-800 mb-3">✏️ Bulk Edit Achievements</h5>
          <div className="space-y-3">
            <p className="text-sm text-green-700">
              Enter achievements one per line. Format: <code>Title|Description|Year</code> (Description and Year are optional)
            </p>
            <p className="text-xs text-green-600 mb-2">
              Examples:<br/>
              <code>First Place in Math Olympics</code><br/>
              <code>Best Library Award|Recognized by the Ministry of Education</code><br/>
              <code>Environmental Initiative Award|Eco-friendly school program|2023</code>
            </p>
            <textarea
              placeholder="Enter achievements here, one per line..."
              value={achievements.map(a => {
                let line = a.title;
                if (a.description) line += `|${a.description}`;
                if (a.year) line += `|${a.year}`;
                return line;
              }).join('\n')}
              onChange={(e) => handleBulkEditAchievements(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            />
            <button
              onClick={handleSaveBulkAchievements}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save All Achievements'}
            </button>
          </div>
        </div>

        {/* Add Single Achievement */}
        <div className="bg-blue-50 p-4 rounded-lg border mt-4">
          <h5 className="text-sm font-semibold text-blue-800 mb-3">➕ Add Single Achievement</h5>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Achievement title..."
              value={newAchievement.title}
              onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Description (optional)..."
              value={newAchievement.description || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Year (optional)..."
              value={newAchievement.year || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddAchievement}
              disabled={!newAchievement.title.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add Achievement'}
            </button>
          </div>
        </div>

        {/* Edit Achievement Modal */}
        {editingAchievement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h6 className="text-lg font-semibold mb-4">Edit Achievement</h6>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Achievement title..."
                  value={editingAchievement.title}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Description (optional)..."
                  value={editingAchievement.description || ''}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Year (optional)..."
                  value={editingAchievement.year || ''}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, year: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleUpdateAchievement(editingAchievement)}
                  disabled={!editingAchievement.title.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => setEditingAchievement(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DIRECTORS SECTION */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">👨‍💼 Directors Management</h4>
        
        {/* View Current Directors */}
        <div className="bg-green-50 p-4 rounded-lg mb-4 border">
          <h5 className="text-sm font-semibold text-green-800 mb-3">👁️ Current Directors ({directors.length})</h5>
          {directors.length > 0 ? (
            <div className="space-y-2">
              {directors.map((director, index) => (
                <div key={director.id} className="flex items-center justify-between p-3 bg-white rounded border-l-4 border-green-400">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{director.name}</p>
                        {director.description && (
                          <p className="text-sm text-gray-600">{director.description}</p>
                        )}
                        {(director.tenure_start || director.tenure_end) && (
                          <p className="text-xs text-green-600">
                            {director.tenure_start} - {director.tenure_end || 'Present'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDirector(director)}
                      className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDirector(director.id!)}
                      className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-600 italic">No directors added yet.</p>
          )}
        </div>

        {/* Add New Director */}
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h5 className="text-sm font-semibold text-blue-800 mb-3">➕ Add New Director</h5>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Director name..."
              value={newDirector.name}
              onChange={(e) => setNewDirector({ ...newDirector, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Tenure start (e.g., 1985 or 1985-2000)..."
              value={newDirector.tenure_start || ''}
              onChange={(e) => setNewDirector({ ...newDirector, tenure_start: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Tenure end (optional, leave empty for current)..."
              value={newDirector.tenure_end || ''}
              onChange={(e) => setNewDirector({ ...newDirector, tenure_end: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Description (optional)..."
              value={newDirector.description || ''}
              onChange={(e) => setNewDirector({ ...newDirector, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddDirector}
              disabled={!newDirector.name.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add Director'}
            </button>
          </div>
        </div>

        {/* Edit Director Modal */}
        {editingDirector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h6 className="text-lg font-semibold mb-4">Edit Director</h6>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Director name..."
                  value={editingDirector.name}
                  onChange={(e) => setEditingDirector({ ...editingDirector, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Tenure start..."
                  value={editingDirector.tenure_start || ''}
                  onChange={(e) => setEditingDirector({ ...editingDirector, tenure_start: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Tenure end..."
                  value={editingDirector.tenure_end || ''}
                  onChange={(e) => setEditingDirector({ ...editingDirector, tenure_end: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Description (optional)..."
                  value={editingDirector.description || ''}
                  onChange={(e) => setEditingDirector({ ...editingDirector, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleUpdateDirector(editingDirector)}
                  disabled={!editingDirector.name.trim() || loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => setEditingDirector(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Link */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-6">
        <h4 className="text-sm font-medium text-green-800 mb-2">👀 Preview Changes</h4>
        <a
          href="/school/history"
          target="_blank"
          className="text-green-700 hover:text-green-900 underline"
        >
          View History Page
        </a>
      </div>
    </div>
  );
};

export default AchievementsDirectorsManager;