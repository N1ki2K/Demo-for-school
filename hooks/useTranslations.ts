import { useState, useEffect } from 'react';
import { apiService } from '../src/services/api';

// Import static translations as fallback
let staticTranslations: { bg?: any; en?: any } = {};
try {
  // Try to import static translations as fallback
  import('../locales/bg').then(module => {
    staticTranslations.bg = module.bg;
  }).catch(() => {});
  import('../locales/en').then(module => {
    staticTranslations.en = module.en;
  }).catch(() => {});
} catch (error) {
  console.log('Static translations not available, using database only');
}

interface TranslationsCache {
  [language: string]: {
    [key: string]: string;
  };
}

let translationsCache: TranslationsCache = {};
let isLoading = false;
let loadPromise: Promise<void> | null = null;

// Helper function to flatten nested objects into dot notation
const flattenObject = (obj: any, prefix = '', result: { [key: string]: string } = {}): { [key: string]: string } => {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
};

export const useTranslations = (language: string = 'bg') => {
  const [translations, setTranslations] = useState<{ [key: string]: string }>(() => {
    // Initialize with cache if available
    return translationsCache[language] || {};
  });
  const [loading, setLoading] = useState(() => {
    // If we have cached translations, we're not loading
    return !translationsCache[language];
  });
  const [error, setError] = useState<string | null>(null);

  const loadTranslations = async (lang: string) => {
    if (translationsCache[lang]) {
      setTranslations(translationsCache[lang]);
      setLoading(false);
      return;
    }

    if (isLoading && loadPromise) {
      await loadPromise;
      if (translationsCache[lang]) {
        setTranslations(translationsCache[lang]);
        setLoading(false);
        return;
      }
    }

    isLoading = true;
    setLoading(true);
    setError(null);

    loadPromise = (async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/translations?lang=${lang}`);
        
        if (!response.ok) {
          throw new Error('Failed to load translations');
        }

        const data = await response.json();
        translationsCache[lang] = data;
        setTranslations(data);
      } catch (err) {
        console.error('Error loading translations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load translations');
        
        // Fallback to static translations if available
        const staticFallback = staticTranslations[lang as keyof typeof staticTranslations];
        if (staticFallback) {
          console.log(`Using static translations fallback for ${lang}`);
          const flattenedStatic = flattenObject(staticFallback);
          translationsCache[lang] = flattenedStatic;
          setTranslations(flattenedStatic);
        } else {
          // Final fallback to empty object
          translationsCache[lang] = {};
          setTranslations({});
        }
      } finally {
        setLoading(false);
        isLoading = false;
        loadPromise = null;
      }
    })();

    await loadPromise;
  };

  useEffect(() => {
    // Only load if we don't already have this language cached
    if (!translationsCache[language]) {
      loadTranslations(language);
    }
  }, [language]);

  // Helper function to get translation by key path with fallback
  const t = (keyPath: string, fallback?: string): string => {
    const translation = translations[keyPath];
    if (translation !== undefined) {
      return translation;
    }
    
    // Try to get nested value (for backward compatibility)
    const keys = keyPath.split('.');
    let current: any = translations;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback || keyPath;
      }
    }
    
    return typeof current === 'string' ? current : (fallback || keyPath);
  };

  // Helper function to get nested translations object (for backward compatibility)
  const getNestedTranslations = () => {
    const nested: any = {};
    
    // If we have translations, build nested object
    if (!loading && Object.keys(translations).length > 0) {
      Object.keys(translations).forEach(keyPath => {
        const keys = keyPath.split('.');
        let current = nested;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!(keys[i] in current)) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = translations[keyPath];
      });
    }
    
    // Create a deep fallback function that creates objects on demand
    const createFallbackObject = (obj: any = {}): any => {
      const handler = {
        get(target: any, prop: string) {
          if (prop in target) {
            const value = target[prop];
            return typeof value === 'object' && value !== null ? createFallbackObject(value) : value;
          }
          
          // Handle special React/JS properties
          if (prop === Symbol.toPrimitive) {
            return () => '';
          }
          if (prop === 'valueOf') {
            return () => '';
          }
          if (prop === 'toString') {
            return () => '';
          }
          
          // For normal property access, return empty string for leaf nodes or empty object for branches
          if (typeof prop === 'string') {
            return '';
          }
          
          return '';
        },
        
        has(target: any, prop: string) {
          return prop in target || typeof prop === 'string';
        }
      };
      
      return new Proxy(obj, handler);
    };
    
    return createFallbackObject(nested);
  };

  // Function to refresh translations (useful after CMS updates)
  const refreshTranslations = async (lang: string = language) => {
    // Clear cache for this language
    delete translationsCache[lang];
    await loadTranslations(lang);
  };

  return {
    translations: getNestedTranslations(),
    flatTranslations: translations,
    loading,
    error,
    t,
    refreshTranslations
  };
};