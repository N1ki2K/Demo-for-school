
export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface Page {
  id: string;
  title: string;
  path: string;
  content: string;
  category: string; // Now uses navigation category IDs
  templateId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  metaDescription?: string;
  keywords?: string;
}
