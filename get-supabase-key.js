// This script helps you get your Supabase anon key
// Run this in the Supabase dashboard SQL editor to verify your setup

const projectRef = 'vxmffyxfqxapbrrmpfhd';

console.log('===============================================');
console.log('SUPABASE SETUP GUIDE');
console.log('===============================================\n');

console.log('Step 1: Get your Anon Key');
console.log('-----------------------');
console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/settings/api');
console.log('2. Find "Project API keys" section');
console.log('3. Copy the "anon" "public" key\n');

console.log('Step 2: Run the Database Schema');
console.log('-----------------------');
console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
console.log('2. Copy the contents of "supabase-schema.sql"');
console.log('3. Paste and click "Run"\n');

console.log('Step 3: Update supabase-config.js');
console.log('-----------------------');
console.log('1. Open "supabase-config.js"');
console.log('2. Replace the SUPABASE_ANON_KEY value with your actual key\n');

console.log('Step 4: Test');
console.log('-----------------------');
console.log('1. Open "tmp_rovodev_test_supabase.html" in a browser');
console.log('2. Update the SUPABASE_ANON_KEY in that file too');
console.log('3. Test the connection\n');

console.log('Your Supabase URL: https://' + projectRef + '.supabase.co');
console.log('===============================================\n');
