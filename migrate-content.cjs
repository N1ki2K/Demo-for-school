#!/usr/bin/env node

/**
 * Simplified Content Migration Script for CMS
 * This script migrates the most important existing content to the CMS database
 */

const API_BASE_URL = 'http://localhost:3001/api';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Key content to migrate
const contentToMigrate = [
  // HomePage Hero Section
  { id: 'hero-title_en', content: 'Welcome to "Kolyo Ganchev" Elementary School', type: 'text', label: 'Hero Title (English)', page_id: 'home' },
  { id: 'hero-title_bg', content: 'Добре дошли в ОУ "Кольо Ганчев"', type: 'text', label: 'Hero Title (Bulgarian)', page_id: 'home' },
  { id: 'hero-subtitle_en', content: 'A place where knowledge and dreams meet.', type: 'text', label: 'Hero Subtitle (English)', page_id: 'home' },
  { id: 'hero-subtitle_bg', content: 'Място, където знанието и мечтите се срещат.', type: 'text', label: 'Hero Subtitle (Bulgarian)', page_id: 'home' },
  { id: 'hero-cta_en', content: 'Admissions 2024/2025', type: 'text', label: 'Hero CTA (English)', page_id: 'home' },
  { id: 'hero-cta_bg', content: 'Прием 2024/2025', type: 'text', label: 'Hero CTA (Bulgarian)', page_id: 'home' },
  { id: 'hero-background_en', content: 'https://picsum.photos/1600/900?random=1', type: 'image', label: 'Hero Background (English)', page_id: 'home' },
  { id: 'hero-background_bg', content: 'https://picsum.photos/1600/900?random=1', type: 'image', label: 'Hero Background (Bulgarian)', page_id: 'home' },

  // News Section
  { id: 'news-title_en', content: 'Latest News', type: 'text', label: 'News Title (English)', page_id: 'home' },
  { id: 'news-title_bg', content: 'Последни новини', type: 'text', label: 'News Title (Bulgarian)', page_id: 'home' },
  { id: 'news-1-title_en', content: 'Opening of the New School Year', type: 'text', label: 'News 1 Title (English)', page_id: 'home' },
  { id: 'news-1-title_bg', content: 'Откриване на новата учебна година', type: 'text', label: 'News 1 Title (Bulgarian)', page_id: 'home' },
  { id: 'news-1-date_en', content: 'September 15, 2024', type: 'text', label: 'News 1 Date (English)', page_id: 'home' },
  { id: 'news-1-date_bg', content: '15 септември 2024', type: 'text', label: 'News 1 Date (Bulgarian)', page_id: 'home' },
  { id: 'news-1-excerpt_en', content: 'With many smiles and excitement, we welcomed our students for the first day of school...', type: 'text', label: 'News 1 Excerpt (English)', page_id: 'home' },
  { id: 'news-1-excerpt_bg', content: 'С много усмивки и вълнение посрещнахме учениците си в първия учебен ден...', type: 'text', label: 'News 1 Excerpt (Bulgarian)', page_id: 'home' },
  { id: 'news-1-image_en', content: 'https://picsum.photos/400/300?random=2', type: 'image', label: 'News 1 Image (English)', page_id: 'home' },
  { id: 'news-1-image_bg', content: 'https://picsum.photos/400/300?random=2', type: 'image', label: 'News 1 Image (Bulgarian)', page_id: 'home' },

  // Features Section
  { id: 'features-title_en', content: 'Why Choose Us?', type: 'text', label: 'Features Title (English)', page_id: 'home' },
  { id: 'features-title_bg', content: 'Защо да изберете нас?', type: 'text', label: 'Features Title (Bulgarian)', page_id: 'home' },
  { id: 'features-subtitle_en', content: 'We offer quality education in a safe and supportive environment, with a focus on the individual development of each student.', type: 'text', label: 'Features Subtitle (English)', page_id: 'home' },
  { id: 'features-subtitle_bg', content: 'Ние предлагаме качествено образование в сигурна и подкрепяща среда, с фокус върху индивидуалното развитие на всяко дете.', type: 'text', label: 'Features Subtitle (Bulgarian)', page_id: 'home' },
  
  { id: 'feature-1-title_en', content: 'Modern Facilities', type: 'text', label: 'Feature 1 Title (English)', page_id: 'home' },
  { id: 'feature-1-title_bg', content: 'Модерни съоръжения', type: 'text', label: 'Feature 1 Title (Bulgarian)', page_id: 'home' },
  { id: 'feature-1-desc_en', content: 'Renovated classrooms and specialized labs.', type: 'text', label: 'Feature 1 Description (English)', page_id: 'home' },
  { id: 'feature-1-desc_bg', content: 'Обновени класни стаи и специализирани лаборатории.', type: 'text', label: 'Feature 1 Description (Bulgarian)', page_id: 'home' },
  
  { id: 'feature-2-title_en', content: 'Experienced Teachers', type: 'text', label: 'Feature 2 Title (English)', page_id: 'home' },
  { id: 'feature-2-title_bg', content: 'Опитни учители', type: 'text', label: 'Feature 2 Title (Bulgarian)', page_id: 'home' },
  { id: 'feature-2-desc_en', content: 'A team of qualified and motivated educators.', type: 'text', label: 'Feature 2 Description (English)', page_id: 'home' },
  { id: 'feature-2-desc_bg', content: 'Екип от квалифицирани и мотивирани педагози.', type: 'text', label: 'Feature 2 Description (Bulgarian)', page_id: 'home' },
  
  { id: 'feature-3-title_en', content: 'Supportive Environment', type: 'text', label: 'Feature 3 Title (English)', page_id: 'home' },
  { id: 'feature-3-title_bg', content: 'Подкрепяща среда', type: 'text', label: 'Feature 3 Title (Bulgarian)', page_id: 'home' },
  { id: 'feature-3-desc_en', content: 'Care and individual attention for every child.', type: 'text', label: 'Feature 3 Description (English)', page_id: 'home' },
  { id: 'feature-3-desc_bg', content: 'Грижа и индивидуално внимание за всяко дете.', type: 'text', label: 'Feature 3 Description (Bulgarian)', page_id: 'home' },

  // Contact Page
  { id: 'address-line1_en', content: '26 Armeyska St', type: 'text', label: 'Address Line 1 (English)', page_id: 'contacts' },
  { id: 'address-line1_bg', content: 'ул. "Армейска" 26', type: 'text', label: 'Address Line 1 (Bulgarian)', page_id: 'contacts' },
  { id: 'address-line2_en', content: '6003 Kazanski, Stara Zagora', type: 'text', label: 'Address Line 2 (English)', page_id: 'contacts' },
  { id: 'address-line2_bg', content: '6003 кв. Казански, Стара Загора', type: 'text', label: 'Address Line 2 (Bulgarian)', page_id: 'contacts' },
  { id: 'director-phone_en', content: '+359 42 123 456', type: 'text', label: 'Director Phone (English)', page_id: 'contacts' },
  { id: 'director-phone_bg', content: '+359 42 123 456', type: 'text', label: 'Director Phone (Bulgarian)', page_id: 'contacts' },
  { id: 'office-phone_en', content: '+359 42 123 457', type: 'text', label: 'Office Phone (English)', page_id: 'contacts' },
  { id: 'office-phone_bg', content: '+359 42 123 457', type: 'text', label: 'Office Phone (Bulgarian)', page_id: 'contacts' },
  { id: 'contact-email_en', content: 'contact@kganchev-school.bg', type: 'text', label: 'Contact Email (English)', page_id: 'contacts' },
  { id: 'contact-email_bg', content: 'contact@kganchev-school.bg', type: 'text', label: 'Contact Email (Bulgarian)', page_id: 'contacts' },

  // Header & Footer Global Content
  { id: 'footer-school-name_en', content: 'Kolyo Ganchev Elementary School', type: 'text', label: 'Footer School Name (English)', page_id: 'global' },
  { id: 'footer-school-name_bg', content: 'ОУ "Кольо Ганчев"', type: 'text', label: 'Footer School Name (Bulgarian)', page_id: 'global' },
  { id: 'footer-motto_en', content: 'Education with care for the future.', type: 'text', label: 'Footer Motto (English)', page_id: 'global' },
  { id: 'footer-motto_bg', content: 'Образование с грижа за бъдещето.', type: 'text', label: 'Footer Motto (Bulgarian)', page_id: 'global' },
  
  // History Page 
  { id: 'history-p1_en', content: '"Kolyo Ganchev" Primary School in Stara Zagora, named after a distinguished Bulgarian revolutionary, first opened its doors in the autumn of 1965.', type: 'text', label: 'History Paragraph 1 (English)', page_id: 'school-history' },
  { id: 'history-p1_bg', content: 'ОУ "Кольо Ганчев" в Стара Загора, наименовано в чест на видния български революционер, отвори врати за първи път през есента на 1965 година.', type: 'text', label: 'History Paragraph 1 (Bulgarian)', page_id: 'school-history' },
  
  // Patron Page
  { id: 'patron-quote_en', content: '"The true heroes are those who sacrifice themselves for their people and their homeland."', type: 'text', label: 'Patron Quote (English)', page_id: 'school-patron' },
  { id: 'patron-quote_bg', content: '"Истинските герои са тези, които се жертват за своя народ и родина."', type: 'text', label: 'Patron Quote (Bulgarian)', page_id: 'school-patron' },
  { id: 'patron-p1_en', content: 'Kolyo Ganchev Vatev, also known as Ganyuolu, was a Bulgarian revolutionary, a prominent participant in the Stara Zagora Uprising of 1875.', type: 'text', label: 'Patron Paragraph 1 (English)', page_id: 'school-patron' },
  { id: 'patron-p1_bg', content: 'Кольо Ганчев Ватев, известен също като Ганьолу, беше български революционер, виден участник в Старозагорското въстание от 1875 година.', type: 'text', label: 'Patron Paragraph 1 (Bulgarian)', page_id: 'school-patron' },

  // Team Page
  { id: 'team-intro_en', content: 'Meet our team of dedicated professionals who work tirelessly for the success and well-being of our students.', type: 'text', label: 'Team Introduction (English)', page_id: 'school-team' },
  { id: 'team-intro_bg', content: 'Запознайте се с нашия екип от отдадени професионалисти, които работят неуморно за успеха и благополучието на нашите ученици.', type: 'text', label: 'Team Introduction (Bulgarian)', page_id: 'school-team' },
];

class ContentMigration {
  constructor() {
    this.token = null;
    this.migratedCount = 0;
  }

  async login() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ADMIN_CREDENTIALS),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.token = data.token;
      console.log('✅ Successfully logged in to CMS');
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      process.exit(1);
    }
  }

  async saveContentSection(section) {
    try {
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(section),
      });

      if (response.ok) {
        this.migratedCount++;
        console.log(`✅ Migrated: ${section.label}`);
        return await response.json();
      } else if (response.status === 409) {
        console.log(`⚠️  Already exists: ${section.label}`);
      } else {
        console.error(`❌ Failed to save ${section.id}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`❌ Error saving section ${section.id}:`, error.message);
    }
  }

  async run() {
    console.log('🚀 Starting content migration...');
    console.log(`📊 Will migrate ${contentToMigrate.length} content sections\n`);
    
    // Check if backend is available
    try {
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      if (!healthResponse.ok) {
        throw new Error('Backend is not responding');
      }
      console.log('✅ Backend is available');
    } catch (error) {
      console.error('❌ Backend is not available. Make sure it\'s running on http://localhost:3001');
      process.exit(1);
    }

    await this.login();
    console.log('📝 Starting content migration...\n');

    // Migrate all content
    for (const content of contentToMigrate) {
      await this.saveContentSection(content);
    }

    console.log(`\n🎉 Content migration completed!`);
    console.log(`📊 Successfully migrated ${this.migratedCount} new content sections`);
    console.log(`🔧 You can now manage all content through the CMS Dashboard!`);
    console.log(`🌐 Visit your website and enable edit mode to see the changes`);
  }
}

// Run the migration
if (require.main === module) {
  const migration = new ContentMigration();
  migration.run().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}