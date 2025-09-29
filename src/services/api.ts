const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    const url = `${API_BASE_URL}/api${endpoint}`;
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
      // For network errors or backend unavailable, throw descriptive error
      console.error('Network/Backend error:', error);
      throw new ApiError(0, 'Unable to connect to server. Please check if the backend is running.');
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
      // Get content by page ID from database - this is the correct way
      const pageContent = await this.getContentByPage(pageId);
      const languageFilteredContent = pageContent.filter(section => section.id.endsWith(`_${language}`));
      
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

  // Pictures folder management
  async getPicturesImages() {
    return this.request<{ images: any[]; total: number }>('/upload/pictures');
  }

  async deletePictureImage(filename: string) {
    return this.request(`/upload/pictures/${filename}`, {
      method: 'DELETE',
    });
  }

  async uploadImageToPictures(file: File): Promise<{ url: string; filename: string; originalName: string; size: number; message: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const url = `${API_BASE_URL}/api/upload/image`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload response not OK:', response.status, response.statusText);
        console.error('Error data:', errorData);
        throw new ApiError(response.status, errorData.error || `Upload failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error during upload');
    }
  }

  // Legacy method - kept for backward compatibility but simplified
  async uploadImage(file: File, folder: string = ''): Promise<{ url: string; filename: string }> {
    return this.uploadImageToPictures(file);
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
    // The member object already uses snake_case field names (is_director, image_url)
    // so we don't need field conversion - just pass it through
    const backendMember = {
      ...member,
      // Ensure boolean conversion for is_director
      is_director: Boolean(member.is_director),
    };
    
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify(backendMember),
    });
  }

  async updateStaffMember(id: string, member: any) {
    // The member object already uses snake_case field names (is_director, image_url)
    // so we don't need field conversion - just pass it through
    const backendMember = {
      ...member,
      // Ensure boolean conversion for is_director
      is_director: Boolean(member.is_director),
    };
    
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

  // School Staff methods (separate table)
  async getSchoolStaff() {
    return this.request<any[]>('/schoolstaff');
  }

  async getSchoolStaffMember(id: string) {
    return this.request<any>(`/schoolstaff/${id}`);
  }

  async createSchoolStaffMember(member: any) {
    return this.request('/schoolstaff', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  async updateSchoolStaffMember(id: string, member: any) {
    return this.request(`/schoolstaff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(member),
    });
  }

  async deleteSchoolStaffMember(id: string) {
    return this.request(`/schoolstaff/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateSchoolStaff(staffList: any[]) {
    return this.request('/schoolstaff/bulk/positions', {
      method: 'PUT',
      body: JSON.stringify({ staffList }),
    });
  }

  // Staff profile image methods
  async getStaffImage(staffId: string) {
    return this.request<any>(`/schoolstaff/${staffId}/image`);
  }

  async setStaffImage(staffId: string, data: {
    image_filename: string;
    image_url: string;
    alt_text?: string;
  }) {
    return this.request(`/schoolstaff/${staffId}/image`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteStaffImage(staffId: string) {
    return this.request(`/schoolstaff/${staffId}/image`, {
      method: 'DELETE',
    });
  }

  // Image mapping methods
  async getImage(id: string) {
    return this.request<any>(`/images/${id}`);
  }

  async getAllImages() {
    return this.request<any[]>('/images');
  }

  async setImageMapping(id: string, data: {
    filename: string;
    original_name?: string;
    url: string;
    alt_text?: string;
    page_id?: string;
    description?: string;
  }) {
    return this.request(`/images/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateImageMapping(id: string, data: {
    filename?: string;
    original_name?: string;
    url?: string;
    alt_text?: string;
    page_id?: string;
    description?: string;
  }) {
    return this.request(`/images/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteImageMapping(id: string) {
    return this.request(`/images/${id}`, {
      method: 'DELETE',
    });
  }

  async getImagesByPage(pageId: string) {
    return this.request<any[]>(`/images/page/${pageId}`);
  }

  // Documents folder management
  async getDocuments() {
    return this.request<{ documents: any[]; total: number }>('/upload/documents');
  }

  async deleteDocument(filename: string) {
    return this.request(`/upload/documents/${filename}`, {
      method: 'DELETE',
    });
  }

  async uploadDocument(file: File): Promise<{ url: string; filename: string; originalName: string; size: number; message: string }> {
    const formData = new FormData();
    formData.append('document', file);

    const url = `${API_BASE_URL}/api/upload/document`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload response not OK:', response.status, response.statusText);
        console.error('Error data:', errorData);
        throw new ApiError(response.status, errorData.error || `Document upload failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error during document upload');
    }
  }

  // PowerPoint presentations folder management
  async getPresentations() {
    return this.request<{ presentations: any[]; total: number }>('/upload/presentations');
  }

  async deletePresentation(filename: string) {
    return this.request(`/upload/presentations/${filename}`, {
      method: 'DELETE',
    });
  }

  async uploadPresentation(file: File): Promise<{ url: string; filename: string; originalName: string; size: number; message: string }> {
    const formData = new FormData();
    formData.append('presentation', file);
    const url = `${API_BASE_URL}/api/upload/presentation`;
    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload response not OK:', response.status, response.statusText);
        console.error('Error data:', errorData);
        throw new ApiError(response.status, errorData.error || `Presentation upload failed: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error during presentation upload');
    }
  }

  // Upload methods
  async uploadFile(file: File, altText?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }

    const response = await fetch(`${API_BASE_URL}/api/upload/single`, {
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

    const response = await fetch(`${API_BASE_URL}/api/upload/multiple`, {
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

  async deletePage(id: string, permanent: boolean = false) {
    const queryParam = permanent ? '?permanent=true' : '';
    return this.request(`/pages/${id}${queryParam}`, {
      method: 'DELETE',
    });
  }

  async reorderPages(pages: any[]) {
    return this.request('/pages/reorder', {
      method: 'POST',
      body: JSON.stringify({ pages }),
    });
  }

  // News methods
  async getNews(language: string = 'bg', publishedOnly: boolean = true) {
    return this.request<any[]>(`/news?lang=${language}&published=${publishedOnly}`);
  }

  async getFeaturedNews(language: string = 'bg', limit: number = 3) {
    return this.request<any[]>(`/news/featured/latest?lang=${language}&limit=${limit}`);
  }

  async getNewsArticle(id: string, language: string = 'bg') {
    return this.request<any>(`/news/${id}?lang=${language}`);
  }

  async getAllNewsForAdmin() {
    return this.request<any[]>('/news/admin/all');
  }

  async createNewsArticle(article: any) {
    return this.request('/news/admin', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateNewsArticle(id: string, article: any) {
    return this.request(`/news/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  }

  async deleteNewsArticle(id: string) {
    return this.request(`/news/admin/${id}`, {
      method: 'DELETE',
    });
  }

  // Events methods
  async getEvents(locale = 'en', start?: string, end?: string) {
    let endpoint = `/events?locale=${locale}`;
    if (start && end) {
      endpoint += `&start=${start}&end=${end}`;
    }
    return this.request<{ events: any[] }>(endpoint);
  }

  async getEvent(id: number) {
    return this.request<{ event: any }>(`/events/${id}`);
  }

  async createEvent(event: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async updateEvent(id: number, event: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(id: number) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async getUpcomingEvents(locale = 'en', limit = 10) {
    return this.request<{ events: any[] }>(`/events/public/upcoming?locale=${locale}&limit=${limit}`);
  }

  // Patron content methods
  async getPatronContent(language: string = 'bg') {
    return this.request<{ success: boolean; content: any[] }>(`/patron?lang=${language}`);
  }

  async getPatronContentForAdmin() {
    return this.request<{ success: boolean; content: any[] }>('/patron/admin');
  }

  async getPatronContentSection(id: string) {
    return this.request<{ success: boolean; content: any }>(`/patron/${id}`);
  }

  async createPatronContent(content: any) {
    return this.request('/patron', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async updatePatronContent(id: string, content: any) {
    return this.request(`/patron/${id}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  async deletePatronContent(id: string) {
    return this.request(`/patron/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderPatronContent(content: any[]) {
    return this.request('/patron/reorder', {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  // Useful Links methods
  async getUsefulLinksContent(language: string = 'bg') {
    return this.request<{ success: boolean; links: any[]; content: any[] }>(`/useful-links?lang=${language}`);
  }

  async getUsefulLinksForAdmin() {
    return this.request<{ success: boolean; links: any[]; content: any[] }>('/useful-links/admin');
  }

  async createUsefulLink(link: any) {
    return this.request('/useful-links/link', {
      method: 'POST',
      body: JSON.stringify(link),
    });
  }

  async updateUsefulLink(id: string, link: any) {
    return this.request(`/useful-links/link/${id}`, {
      method: 'PUT',
      body: JSON.stringify(link),
    });
  }

  async deleteUsefulLink(id: string) {
    return this.request(`/useful-links/link/${id}`, {
      method: 'DELETE',
    });
  }

  async createUsefulLinksContent(content: any) {
    return this.request('/useful-links/content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async updateUsefulLinksContent(id: string, content: any) {
    return this.request(`/useful-links/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  async reorderUsefulLinks(links?: any[], content?: any[]) {
    return this.request('/useful-links/reorder', {
      method: 'PUT',
      body: JSON.stringify({ links, content }),
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

  // Check if error is a backend connection issue
  static isBackendConnectionError(error: any): boolean {
    return (error instanceof ApiError && error.status === 0) || 
           (error instanceof Error && (
             error.message.includes('Unable to connect to server') ||
             error.message.includes('fetch') ||
             error.message.includes('NetworkError') ||
             error.message.includes('Failed to fetch')
           ));
  }

  // Navigation menu management
  async getNavigationMenuItems() {
    return this.request<{ items: any[]; total: number }>('/navigation/menu-items');
  }

  async getHeaderNavigation() {
    return this.request<{ navigation: any[] }>('/navigation/header-menu');
  }

  async createNavigationMenuItem(data: {
    title: string;
    path: string;
    position: number;
    isActive: boolean;
    parentId?: string | null;
  }) {
    return this.request('/navigation/menu-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNavigationMenuItem(id: string, data: {
    title: string;
    path: string;
    position: number;
    isActive: boolean;
    parentId?: string | null;
  }) {
    return this.request(`/navigation/menu-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleNavigationMenuItem(id: string) {
    return this.request(`/navigation/menu-items/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  async deleteNavigationMenuItem(id: string) {
    return this.request(`/navigation/menu-items/${id}`, {
      method: 'DELETE',
    });
  }

  // ============== ACHIEVEMENTS API ==============

  async getAchievements() {
    return this.request<any[]>('/achievements', {
      method: 'GET',
    });
  }

  async getAchievement(id: number) {
    return this.request<any>(`/achievements/${id}`, {
      method: 'GET',
    });
  }

  async createAchievement(data: {
    title: string;
    description?: string;
    year?: number;
    position?: number;
  }) {
    return this.request<any>('/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAchievement(id: number, data: {
    title: string;
    description?: string;
    year?: number;
    position?: number;
    is_active?: boolean;
  }) {
    return this.request<any>(`/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAchievement(id: number) {
    return this.request<any>(`/achievements/${id}`, {
      method: 'DELETE',
    });
  }

  async updateAchievementPositions(achievements: Array<{ id: number; position: number }>) {
    return this.request<any>('/achievements/bulk/positions', {
      method: 'PUT',
      body: JSON.stringify({ achievements }),
    });
  }

  // ============== DIRECTORS API ==============

  async getDirectors() {
    return this.request<any[]>('/directors', {
      method: 'GET',
    });
  }

  async getDirector(id: number) {
    return this.request<any>(`/directors/${id}`, {
      method: 'GET',
    });
  }

  async createDirector(data: {
    name: string;
    tenure_start?: string;
    tenure_end?: string;
    description?: string;
    position?: number;
  }) {
    return this.request<any>('/directors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDirector(id: number, data: {
    name: string;
    tenure_start?: string;
    tenure_end?: string;
    description?: string;
    position?: number;
    is_active?: boolean;
  }) {
    return this.request<any>(`/directors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDirector(id: number) {
    return this.request<any>(`/directors/${id}`, {
      method: 'DELETE',
    });
  }

  async updateDirectorPositions(directors: Array<{ id: number; position: number }>) {
    return this.request<any>('/directors/bulk/positions', {
      method: 'PUT',
      body: JSON.stringify({ directors }),
    });
  }
}

export const apiService = new ApiService();
export { ApiError };