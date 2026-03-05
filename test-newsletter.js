#!/usr/bin/env node

import axios from 'axios';

// Test the newsletter subscription
async function testNewsletter() {
  console.log('🧪 Testing newsletter subscription...');
  
  try {
    // Test with a sample email
    const testEmail = 'test@example.com';
    
    const response = await axios.post('http://localhost:3000/.netlify/functions/newsletter', {
      email: testEmail
    });
    
    console.log('✅ Newsletter function test successful!');
    console.log('📧 Response:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('⚠️ Function responded with:', error.response.status, error.response.data);
      
      if (error.response.status === 409) {
        console.log('✅ This is expected - email already exists or function is working correctly');
      } else if (error.response.status === 500) {
        console.log('❌ Server error - check environment variables');
      }
    } else {
      console.log('❌ Network error - make sure dev server is running');
    }
  }
}

testNewsletter();
