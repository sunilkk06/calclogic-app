# Newsletter Subscription Setup

This document explains how to set up the Mailchimp newsletter subscription feature for CalcLogic.

## Prerequisites

1. **Mailchimp Account**: Create a free account at [mailchimp.com](https://mailchimp.com)
2. **Audience/List**: Create an audience to store subscribers

## Getting Mailchimp Credentials

### 1. API Key
- Log into Mailchimp
- Go to Account > Extras > API keys
- Click "Create A Key"
- Copy the API key (it looks like: `xxxxxxxxxxxxxxxxxxxx-usxx`)

### 2. Audience ID
- Go to Audience > All contacts
- Go to Settings > Audience name and defaults
- Find the Audience ID in the URL or settings page
- It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3`

## Environment Setup

### For Local Development
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and replace with your actual credentials:
```
VITE_MAILCHIMP_API_KEY=your_actual_api_key_here
VITE_MAILCHIMP_AUDIENCE_ID=your_actual_audience_id_here
```

### For Production (Netlify)
1. Go to your Netlify site dashboard
2. Go to Site settings > Build & deploy > Environment
3. Add these environment variables:
   - `MAILCHIMP_API_KEY`: Your Mailchimp API key
   - `MAILCHIMP_AUDIENCE_ID`: Your Mailchimp audience ID

## Installation

Install the required dependency:
```bash
npm install
```

## Testing

1. Start the development server:
```bash
npm run dev
```

2. Go to the footer of the site
3. Enter a test email address and click subscribe
4. Check your Mailchimp audience to verify the subscription

## Features

- ✅ Email validation
- ✅ Loading states
- ✅ Success/error messages
- ✅ Duplicate email detection
- ✅ Secure API integration
- ✅ Responsive design
- ✅ Accessibility support

## Troubleshooting

### Common Issues

1. **"Server configuration error"**
   - Check that environment variables are set correctly
   - Ensure Netlify environment variables are configured for production

2. **"Invalid email address"**
   - Verify email format is correct
   - Check that email validation regex is working

3. **"This email is already subscribed"**
   - This is normal - the user is already in your Mailchimp audience
   - You can verify this in your Mailchimp dashboard

4. **Function not found (404)**
   - Ensure `netlify/functions/newsletter.js` exists
   - Deploy the site to Netlify to activate functions

### Debug Mode

To enable debug logging, add this to your Netlify function:
```javascript
console.log('Debug info:', { email, API_KEY: API_KEY?.substring(0, 10) + '...' });
```

## Security Notes

- ✅ API keys are stored in environment variables
- ✅ No sensitive data exposed to client-side
- ✅ Input validation and sanitization
- ✅ CORS properly configured
- ✅ Error handling prevents information leakage

## GDPR Compliance

The implementation includes:
- Clear consent mechanism (user must actively subscribe)
- Email validation to prevent accidental submissions
- Error messages that don't expose personal data
- Ability to unsubscribe via Mailchimp's standard process

## Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check Netlify function logs
3. Verify Mailchimp credentials are correct
4. Test with different email addresses
