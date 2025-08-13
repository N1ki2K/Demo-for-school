#!/usr/bin/env node

/**
 * Staff Migration Script for CMS
 * This script adds sample staff data to test the director/teacher separation
 */

const API_BASE_URL = 'http://localhost:3001/api';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Sample staff data
const staffData = [
  {
    name: 'Galina Petkova',
    role: 'Principal',
    email: 'g.petkova@kganchev-school.bg',
    phone: '+359 42 123 456',
    bio: 'Experienced educator with over 20 years in educational leadership.',
    image_url: 'https://picsum.photos/400/400?random=100',
    is_director: true,
    position: 0
  },
  {
    name: 'Neli Dimova',
    role: 'Primary Teacher',
    email: 'n.dimova@kganchev-school.bg',
    phone: '+359 42 123 457',
    bio: 'Dedicated teacher specializing in early childhood education.',
    image_url: 'https://picsum.photos/400/400?random=101',
    is_director: false,
    position: 1
  },
  {
    name: 'Sonya Aladzhova',
    role: 'Primary Teacher',
    email: 's.aladzhova@kganchev-school.bg',
    phone: '+359 42 123 458',
    bio: 'Creative educator with expertise in arts and literature.',
    image_url: 'https://picsum.photos/400/400?random=102',
    is_director: false,
    position: 2
  },
  {
    name: 'Plamena Marinova',
    role: 'Mathematics Teacher',
    email: 'p.marinova@kganchev-school.bg',
    phone: '+359 42 123 459',
    bio: 'Mathematics specialist with focus on problem-solving skills.',
    image_url: 'https://picsum.photos/400/400?random=103',
    is_director: false,
    position: 3
  },
  {
    name: 'Diana Belcheva',
    role: 'English Teacher',
    email: 'd.belcheva@kganchev-school.bg',
    phone: '+359 42 123 460',
    bio: 'Language teacher promoting communication and cultural awareness.',
    image_url: 'https://picsum.photos/400/400?random=104',
    is_director: false,
    position: 4
  }
];

class StaffMigration {
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

  async createStaffMember(member) {
    try {
      const response = await fetch(`${API_BASE_URL}/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(member),
      });

      if (response.ok) {
        this.migratedCount++;
        console.log(`✅ Added: ${member.name} (${member.is_director ? 'Director' : 'Teacher'})`);
        return await response.json();
      } else if (response.status === 409) {
        console.log(`⚠️  Already exists: ${member.name}`);
      } else {
        console.error(`❌ Failed to add ${member.name}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`❌ Error adding ${member.name}:`, error.message);
    }
  }

  async run() {
    console.log('🚀 Starting staff migration...');
    console.log(`📊 Will add ${staffData.length} staff members\n`);
    
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
    console.log('📝 Starting staff migration...\n');

    // Add all staff
    for (const member of staffData) {
      await this.createStaffMember(member);
    }

    console.log(`\n🎉 Staff migration completed!`);
    console.log(`📊 Successfully added ${this.migratedCount} staff members`);
    console.log(`👥 Director/Teacher separation should now work in the Team page`);
    console.log(`🌐 Visit the Team page to see the separated Leadership and Teachers sections`);
  }
}

// Run the migration
if (require.main === module) {
  const migration = new StaffMigration();
  migration.run().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}