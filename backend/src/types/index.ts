export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'list' | 'table' | 'rich_text';
  label: string;
  content: string;
  page_id?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  bio?: string;
  image_url?: string;
  is_director: boolean;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  meta_description?: string;
  is_published: boolean;
  template: string;
  created_at: string;
  updated_at: string;
}

export interface MediaFile {
  id: string;
  original_name: string;
  filename: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text?: string;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updated_at: string;
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}