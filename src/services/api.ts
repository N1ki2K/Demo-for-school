const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('cms_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.error || 'Request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 403) {
          this.clearToken();
          window.location.href = '/';
        }
        throw error;
      }
      throw new ApiError(0, 'Network error');
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.token = data.token;
    localStorage.setItem('cms_token', data.token);
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('cms_token');
  }

  // Content methods
  async getContentSections() {
    return this.request<any[]>('/content');
  }

  async getContentByPage(pageId: string) {
    return this.request<any[]>(`/content/page/${pageId}`);
  }

  async getContentByPageAndLanguage(pageId: string, language: string) {
    try {
      // First try to get content by page
      const pageContent = await this.getContentByPage(pageId);
      const languageFilteredContent = pageContent.filter(section => section.id.endsWith(`_${language}`));
      
      // If no page-specific content found, get all content and filter by language and inferred page association
      if (languageFilteredContent.length === 0) {
        const allContent = await this.getContentSections();
        const filtered = allContent.filter(section => {
          const id = section.id;
          // Check if it ends with the language
          if (!id.endsWith(`_${language}`)) return false;
          
          // For specific page patterns, try to infer page association
          const baseId = id.replace(`_${language}`, '');
          
          // Map common content patterns to pages
          if (pageId === 'home') {
            return baseId.includes('hero') || baseId.includes('news') || baseId.includes('features');
          }
          if (pageId === 'contacts') {
            return baseId.includes('address') || baseId.includes('phone') || baseId.includes('email') || 
                   baseId.includes('contact') || baseId.includes('worktime');
          }
          if (pageId === 'global') {
            return baseId.includes('header') || baseId.includes('footer') || baseId.includes('nav');
          }
          
          // For document/project pages, check if the base ID contains the page identifier
          if (pageId.startsWith('documents-') || pageId.startsWith('projects-') || pageId.startsWith('school-')) {
            const pageKeyword = pageId.replace('documents-', '').replace('projects-', '').replace('school-', '');
            return baseId.includes(pageKeyword) || baseId.includes(pageId);
          }
          
          return false;
        });
        
        return filtered;
      }
      
      return languageFilteredContent;
    } catch (error) {
      console.error('Error getting content by page and language:', error);
      return [];
    }
  }

  async getContentSection(id: string) {
    return this.request<any>(`/content/${id}`);
  }

  async saveContentSection(section: any) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify(section),
    });
  }

  async updateContentSection(id: string, section: any) {
    return this.request(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(section),
    });
  }

  async deleteContentSection(id: string) {
    return this.request(`/content/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateContentSections(sections: any[]) {
    return this.request('/content/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ sections }),
    });
  }

  // Staff methods
  async getStaffMembers() {
    const staff = await this.request<any[]>('/staff');
    // Convert backend field names to frontend field names
    return staff.map(member => ({
      ...member,
      imageUrl: member.image_url,
      isDirector: Boolean(member.is_director),
    }));
  }

  async getStaffMember(id: string) {
    return this.request<any>(`/staff/${id}`);
  }

  async createStaffMember(member: any) {
    // Convert frontend field names to backend field names
    const backendMember = {
      ...member,
      image_url: member.imageUrl,
      is_director: member.isDirector,
    };
    // Remove frontend field names
    delete backendMember.imageUrl;
    delete backendMember.isDirector;
    
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify(backendMember),
    });
  }

  async updateStaffMember(id: string, member: any) {
    // Convert frontend field names to backend field names
    const backendMember = {
      ...member,
      image_url: member.imageUrl,
      is_director: member.isDirector,
    };
    // Remove frontend field names
    delete backendMember.imageUrl;
    delete backendMember.isDirector;
    
    return this.request(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendMember),
    });
  }

  async deleteStaffMember(id: string) {
    return this.request(`/staff/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderStaffMembers(staffMembers: any[]) {
    return this.request('/staff/reorder', {
      method: 'POST',
      body: JSON.stringify({ staffMembers }),
    });
  }

  // Upload methods
  async uploadFile(file: File, altText?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }

    const response = await fetch(`${API_BASE_URL}/upload/single`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.error || 'Upload failed');
    }

    return response.json();
  }

  async uploadMultipleFiles(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.error || 'Upload failed');
    }

    return response.json();
  }

  async getMediaFiles(page = 1, limit = 20) {
    return this.request<{ files: any[]; pagination: any }>(`/upload/files?page=${page}&limit=${limit}`);
  }

  async deleteMediaFile(id: string) {
    return this.request(`/upload/files/${id}`, {
      method: 'DELETE',
    });
  }

  async updateMediaFile(id: string, altText: string) {
    return this.request(`/upload/files/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ altText }),
    });
  }

  // Pages methods
  async getPages() {
    return this.request<any[]>('/pages');
  }

  async getAllPages() {
    return this.request<any[]>('/pages/all');
  }

  async createPage(page: any) {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
  }

  async updatePage(id: string, page: any) {
    return this.request(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(page),
    });
  }

  async deletePage(id: string) {
    return this.request(`/pages/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderPages(pages: any[]) {
    return this.request('/pages/reorder', {
      method: 'POST',
      body: JSON.stringify({ pages }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export { ApiError };