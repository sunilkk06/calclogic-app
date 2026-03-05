const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email address' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    // Get environment variables
    const API_KEY = process.env.MAILCHIMP_API_KEY || process.env.VITE_MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID || process.env.VITE_MAILCHIMP_AUDIENCE_ID;

    if (!API_KEY || !AUDIENCE_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    // Extract datacenter from API key
    const dataCenter = API_KEY.split('-')[1];
    const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    // Check if email already exists
    const checkUrl = `${url}/${encodeURIComponent(email.toLowerCase())}`;
    
    try {
      const checkResponse = await axios.get(checkUrl, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // Email already exists and is subscribed
      if (checkResponse.data.status === 'subscribed') {
        return {
          statusCode: 409,
          body: JSON.stringify({ 
            error: 'This email is already subscribed to our newsletter.' 
          }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        };
      }
    } catch (error) {
      // Email doesn't exist, continue with subscription
      if (error.response && error.response.status !== 404) {
        throw error;
      }
    }

    // Subscribe email to Mailchimp
    const response = await axios.post(url, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        'SOURCE': 'CalcLogic Website'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Successfully subscribed to newsletter!'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Handle specific Mailchimp errors
    if (error.response && error.response.data) {
      const mailchimpError = error.response.data;
      
      if (mailchimpError.title === 'Member Exists') {
        return {
          statusCode: 409,
          body: JSON.stringify({ 
            error: 'This email is already subscribed to our newsletter.' 
          }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        };
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to subscribe. Please try again later.' 
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }
};
