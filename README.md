# Visual CMS Integration Guide

This project now includes a comprehensive Visual Content Management System (CMS) that allows administrators to edit content directly on the website without touching code.

## Features

- **Visual Editing**: Click directly on content to edit it inline
- **Image Management**: Change images by providing new URLs
- **List Editing**: Add, remove, and modify list items
- **User Authentication**: Simple login system to control access
- **Persistent Storage**: All changes are saved to browser localStorage
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### 1. Login to CMS

1. Look for the **Login** button in the top-right corner of the website (next to the language selector)
2. Click it to open the login modal
3. Use your configured admin credentials (set via environment variables)

### 2. Enter Edit Mode

Once logged in, you'll see two buttons:
- **Edit**: Click to enter edit mode
- **Logout**: Click to log out of the CMS

Click **Edit** to activate the visual editing interface.

### 3. Edit Content

When in edit mode, you'll see:
- Blue dashed outlines around editable content
- "Click to edit" tooltips on hover
- A green toolbar at the bottom-right indicating edit mode is active

## Content Types

### Text Content

- **Single-line text**: Click and type directly
- **Multi-line text**: Click and type, press Enter to save
- **Keyboard shortcuts**:
  - `Enter`: Save changes
  - `Escape`: Cancel changes

### Images

1. Click on any image in edit mode
2. Click the "Edit" button that appears
3. Enter a new image URL in the modal
4. Click "Save" to apply changes

### Lists

1. Look for the "Edit List" button on lists
2. Click it to open the list editor
3. Use the interface to:
   - Add new items
   - Remove existing items
   - Modify item text
4. Click "Save" when finished

## Technical Implementation

### Core Components

#### 1. CMS Context (`context/CMSContext.tsx`)
Manages the global CMS state including:
- Authentication status
- Edit mode state
- Content storage and retrieval
- CRUD operations for content

#### 2. Editable Components

**EditableText** (`components/cms/EditableText.tsx`)
```tsx
<EditableText
  id="unique-identifier"
  defaultContent="Default text content"
  tag="p" // or h1, h2, span, etc.
  className="your-css-classes"
/>
```

**EditableImage** (`components/cms/EditableImage.tsx`)
```tsx
<EditableImage
  id="unique-identifier"
  defaultSrc="https://example.com/image.jpg"
  alt="Image description"
  className="your-css-classes"
/>
```

**EditableList** (`components/cms/EditableList.tsx`)
```tsx
<EditableList
  id="unique-identifier"
  defaultItems={["Item 1", "Item 2", "Item 3"]}
  className="your-css-classes"
  ordered={false} // true for numbered lists
/>
```

#### 3. Login Component (`components/cms/LoginButton.tsx`)
Handles authentication and provides edit mode toggle.

#### 4. CMS Toolbar (`components/cms/CMSToolbar.tsx`)
Shows edit status and provides help documentation.

### Adding CMS to New Pages

1. Import the editable components:
```tsx
import { EditableText } from '../components/cms/EditableText';
import { EditableImage } from '../components/cms/EditableImage';
import { EditableList } from '../components/cms/EditableList';
```

2. Replace static content with editable components:
```tsx
// Before
<h1>Static Title</h1>

// After
<EditableText
  id="page-title"
  defaultContent="Static Title"
  tag="h1"
  className="your-classes"
/>
```

3. Ensure each editable element has a unique ID across the entire site.

### Content Storage

Content is stored in browser localStorage under the key `cms_content`. The data structure is:

```typescript
{
  [sectionId: string]: {
    id: string;
    type: 'text' | 'image' | 'list';
    content: any;
    label: string;
  }
}
```

## Styling

The CMS includes custom CSS for the editing interface:

- `.cms-editable`: Base class for editable elements
- `.cms-editing`: Applied when actively editing
- `.cms-toolbar`: Styling for the edit mode toolbar

Add these styles to your `index.css`:

```css
/* CMS Editing Styles */
.cms-editable {
  position: relative;
  transition: all 0.2s ease;
}

.cms-editable:hover {
  outline: 2px dashed #3B82F6;
  outline-offset: 2px;
  cursor: pointer;
}

/* ... more styles ... */
```

## Security Considerations

⚠️ **Important**: This is a demo CMS with basic authentication. For production use:

1. Implement proper user authentication with secure password hashing
2. Add role-based permissions
3. Use a backend database instead of localStorage
4. Implement proper session management
5. Add input validation and sanitization
6. Consider using a proper CMS solution for production sites

## Browser Compatibility

The CMS works in all modern browsers that support:
- ES6+ JavaScript features
- localStorage API
- CSS Grid and Flexbox
- Modern DOM APIs

## Troubleshooting

**Content not saving?**
- Check browser localStorage quota
- Ensure unique IDs for all editable elements
- Check browser console for errors

**Can't enter edit mode?**
- Verify you're logged in
- Check that the CMSProvider wraps your app
- Ensure the context is properly imported

**Styling issues?**
- Verify CMS CSS is included
- Check for CSS conflicts with existing styles
- Ensure Tailwind classes are properly loaded

## Examples

See the updated files for implementation examples:
- `pages/HomePage.tsx` - Complex page with multiple content types
- `pages/ContactsPage.tsx` - Simple contact information editing
- `pages/school/HistoryPage.tsx` - Text and list editing

## Future Enhancements

Potential improvements for a production version:
- Rich text editor integration
- File upload for images
- Content versioning and history
- Multi-user editing
- Content scheduling
- SEO meta tag editing
- Bulk content operations
- Export/import functionality
