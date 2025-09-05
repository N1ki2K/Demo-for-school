const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

// Read and parse TypeScript files manually since we can't import them directly
function loadTranslations(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Extract the export object using regex (simple approach)
  const match = content.match(/export const \w+ = ({[\s\S]*});?\s*$/);
  if (!match) {
    throw new Error(`Could not parse translations from ${filePath}`);
  }
  
  // Use eval to parse the object (not ideal but works for this migration)
  // In production, you'd want a proper TypeScript parser
  return eval(`(${match[1]})`);
}

// Load translations
const en = loadTranslations('../locales/en.ts');
const bg = loadTranslations('../locales/bg.ts');

const dbPath = './database/cms.db';

console.log('🔄 Starting translation migration...');

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('📊 Connected to database');
});

// Function to flatten nested objects into dot notation paths
function flattenObject(obj, prefix = '', result = {}) {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

// Flatten both language objects
const flatEN = flattenObject(en);
const flatBG = flattenObject(bg);

// Get all unique keys
const allKeys = new Set([...Object.keys(flatEN), ...Object.keys(flatBG)]);

console.log(`📝 Found ${allKeys.size} translation keys to migrate`);

// Prepare batch insert
const stmt = db.prepare(`
  INSERT OR REPLACE INTO translations (id, key_path, text_bg, text_en, description, category)
  VALUES (?, ?, ?, ?, ?, ?)
`);

let processed = 0;
const total = allKeys.size;

// Insert each translation
for (const key of allKeys) {
  const id = key.replace(/\./g, '_');
  const category = key.split('.')[0]; // First part of the key path
  const description = `Translation for ${key}`;
  
  stmt.run([
    id,
    key,
    flatBG[key] || null,
    flatEN[key] || null,
    description,
    category
  ], (err) => {
    if (err) {
      console.error(`Error inserting ${key}:`, err);
    }
    processed++;
    
    if (processed === total) {
      console.log('✅ Translation migration completed successfully!');
      
      // Close prepared statement and database
      stmt.finalize();
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('📊 Database connection closed');
          console.log('\n📋 Next steps:');
          console.log('1. Update your components to use database translations');
          console.log('2. Remove the locales files when no longer needed');
          console.log('3. Test the CMS translation editing interface');
        }
      });
    }
  });
}