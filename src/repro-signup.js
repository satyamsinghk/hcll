const axios = require('axios');

async function run() {
  const newUser = {
    name: 'Test Signer',
    email: `test_signup_${Date.now()}@hms.com`,
    password: 'password123',
    username: `user_${Date.now()}`,
    role: 'STUDENT'
  };

  try {
    console.log('Testing Signup with new user...');
    const res = await axios.post('http://localhost:5001/api/auth/signup', newUser);
    console.log('✅ Signup Success:', res.status, res.data.user.email);
  } catch (e) {
    if (e.response) {
      console.log('❌ Signup Failed Status:', e.response.status);
      console.log('❌ Body:', JSON.stringify(e.response.data, null, 2));
    } else {
      console.log('Error:', e.message);
    }
  }

  // Test Duplicate
  try {
    console.log('\nTesting Duplicate Signup (Admin)...');
    // Admin was seeded earlier
    const duplicateUser = {
      name: 'Duplicate Admin',
      email: 'admin@hms.com', 
      password: 'password',
      username: 'admin', 
      role: 'ADMIN'
    };
    await axios.post('http://localhost:5001/api/auth/signup', duplicateUser);
  } catch (e) {
    if (e.response) {
      console.log('❌ Duplicate Failed Status:', e.response.status);
      console.log('❌ Body:', JSON.stringify(e.response.data, null, 2));
    } else {
      console.log('Error:', e.message);
    }
  }
}

run();
