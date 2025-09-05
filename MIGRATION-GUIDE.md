# Database-Driven Content Migration Guide

This guide explains how to migrate from hardcoded text content to database-driven, editable content.

## Overview

All text content has been moved from static TypeScript files (`locales/bg.ts` and `locales/en.ts`) to a database-driven system that allows real-time editing through the CMS interface.

## New Architecture

### Database Schema
- **translations** table: Stores all translatable text content
- **events** table: Calendar events with multilingual support
- **patron_content** table: Patron page content sections
- **useful_links** table: Useful links with descriptions
- **useful_links_content** table: Content sections for useful links page

### API Endpoints
- `GET /api/translations` - Fetch all translations
- `PUT /api/translations/:id` - Update specific translation
- `GET /api/translations/nested/:lang` - Get nested translation object

### New Components
- **TranslationsManagerTab**: CMS interface for editing all translations
- **useTranslations** hook: Fetches translations from database
- Updated **LanguageContext**: Now uses database instead of static files

## Migration Steps

### 1. Run Database Migration

First, ensure your backend database is updated with the new tables:

```bash
cd backend
npm run dev  # This will create new tables automatically
```

### 2. Seed Translation Data

Run the migration script to transfer content from locales files to database:

```bash
cd backend
node migrate-translations.js
```

This will:
- Read all content from `locales/bg.ts` and `locales/en.ts`
- Convert nested objects to dot-notation keys (e.g., `header.title` → `header_title`)
- Insert all translations into the database
- Handle both Bulgarian and English content

### 3. Verify Migration

1. Start your backend server: `cd backend && npm run dev`
2. Start your frontend: `cd .. && npm run dev`
3. Log into CMS and go to the "Translations" tab
4. Verify all content is present and editable

### 4. Update Components (Already Done)

The following components have been updated to use database content:

- **LanguageContext**: Now fetches from API instead of static imports
- **useTranslations**: New hook for accessing database translations
- **TranslationsManagerTab**: New CMS interface for editing

### 5. Remove Old Files (Optional)

After confirming everything works, you can remove:
- `locales/bg.ts`
- `locales/en.ts`
- Any imports of these files in components

## Using the New System

### In Components

Components now use the database-driven language context:

```tsx
import { useLanguage } from '../context/LanguageContext';

const MyComponent = () => {
  const { t, getTranslation, loading, error } = useLanguage();
  
  // Option 1: Use nested object (backward compatible)
  return <h1>{t.header.title}</h1>;
  
  // Option 2: Use flat key function (recommended)
  return <h1>{getTranslation('header.title', 'Default Title')}</h1>;
};
```

### In CMS

1. Log into CMS
2. Go to "Content" → "Translations"
3. Search and filter translations
4. Edit Bulgarian and English versions
5. Save changes - they appear immediately on the website

## Key Benefits

### For Administrators
- **Real-time editing**: Changes appear immediately without code deployment
- **No technical knowledge needed**: Edit through web interface
- **Search and filter**: Find specific translations easily
- **Organized by category**: Content grouped logically

### For Developers
- **Database-driven**: All content stored in database
- **API-first**: RESTful endpoints for all operations
- **Type-safe**: TypeScript interfaces for all data structures
- **Backward compatible**: Existing component code mostly unchanged

## Troubleshooting

### Translation Not Updating
- Clear browser cache
- Check CMS for correct translation values
- Verify backend server is running
- Check browser console for API errors

### Missing Translations
- Run the migration script again
- Check database contains expected records:
  ```sql
  SELECT COUNT(*) FROM translations;
  SELECT * FROM translations WHERE key_path LIKE 'header.%';
  ```

### API Connection Issues
- Verify backend server is running on correct port
- Check CORS configuration
- Verify authentication token is valid

## Database Structure

### translations table
```sql
CREATE TABLE translations (
  id TEXT PRIMARY KEY,
  key_path TEXT NOT NULL UNIQUE,
  text_bg TEXT,
  text_en TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Key Fields
- **key_path**: Dot-notation path (e.g., 'header.title')
- **text_bg**: Bulgarian translation
- **text_en**: English translation
- **category**: Grouping for organization (nav, header, footer, etc.)

## Content Categories

Content is automatically categorized based on the first part of the key path:

- **header**: Header navigation and branding
- **footer**: Footer links and information
- **nav**: Main navigation menu
- **homepage**: Home page content
- **cms**: CMS interface labels
- **pages**: Individual page content

## Performance Considerations

- Translations are cached in memory after first load
- API calls are batched for initial page load
- Changes are reflected immediately without cache invalidation
- Database queries are optimized with indexes on key_path

## Future Enhancements

Possible improvements for production:

1. **Versioning**: Track content changes over time
2. **Approval workflow**: Require approval before publishing changes
3. **Import/Export**: Bulk operations for translations
4. **Rich text editing**: Support for formatted content
5. **Image management**: Associate images with text content

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify backend logs for API issues
3. Confirm database contains expected data
4. Test API endpoints directly using tools like Postman

The system is designed to be robust and fall back gracefully if translations are missing or if there are connection issues.