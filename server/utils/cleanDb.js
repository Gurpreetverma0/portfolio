/**
 * cleanDb.js
 * Wipes ALL seed/dummy content from MongoDB.
 * Keeps: Admin user, Profile, WebsiteSettings (your config stays intact).
 * Deletes: Projects, Skills, Achievements, Certificates, Gallery,
 *          Experience, Education, Services, Testimonials, Blogs,
 *          ContactMessages, Analytics, ActivityLogs
 *
 * Run with:  node utils/cleanDb.js
 */

import mongoose from 'mongoose';
import { env } from '../config/env.js';

const MONGODB_URI = env.mongoUri;

const collections = [
  'projects',
  'skills',
  'achievements',
  'certificates',
  'galleries',
  'experiences',
  'educations',
  'services',
  'testimonials',
  'blogs',
  'contactmessages',
  'analytics',
  'activitylogs',
];

async function cleanDb() {
  console.log('\n🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected:', mongoose.connection.host);

  console.log('\n🗑️  Clearing all seed/dummy content...\n');

  for (const col of collections) {
    try {
      const result = await mongoose.connection.db.collection(col).deleteMany({});
      console.log(`   ✅ ${col.padEnd(20)} → deleted ${result.deletedCount} documents`);
    } catch (err) {
      console.log(`   ⚠️  ${col.padEnd(20)} → skipped (${err.message})`);
    }
  }

  console.log('\n📋 Keeping intact:');
  console.log('   ✅ admins              (your login credentials)');
  console.log('   ✅ profiles            (your profile config)');
  console.log('   ✅ websitesettings     (site config & section order)');

  console.log('\n🎉 Database cleaned! Website sections now show empty states.');
  console.log('   → Add real content via Admin Dashboard at /admin\n');

  await mongoose.disconnect();
  process.exit(0);
}

cleanDb().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
