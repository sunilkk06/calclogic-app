#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables for newsletter integration
const envContent = `# Mailchimp Configuration
VITE_MAILCHIMP_API_KEY=your-api-key-here-us14
VITE_MAILCHIMP_AUDIENCE_ID=92eac6f486
`;

const envPath = path.join(__dirname, '.env');

// Write the .env file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Environment variables configured successfully!');
console.log('📁 .env file created at:', envPath);
console.log('');
console.log('🔧 Next steps:');
console.log('1. Run "npm run dev" to test locally');
console.log('2. Add these same variables to your Netlify environment:');
console.log('   - MAILCHIMP_API_KEY=your-api-key-here-us14');
console.log('   - MAILCHIMP_AUDIENCE_ID=92eac6f486');
console.log('');
console.log('🎯 Your newsletter integration is ready to test!');
