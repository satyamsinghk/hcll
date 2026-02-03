const axios = require('axios');

async function run() {
  try {
    // 1. Try to sign in with non-existent user
    console.log('Testing non-existent user...');
    await axios.post('http://localhost:5000/api/auth/signin', {
      email: 'fake@user.com',
      password: 'password'
    });
  } catch (e) {
    if (e.response) {
      console.log('❌ Status:', e.response.status); // Expect 500
      console.log('❌ Body:', e.response.data);
    } else {
      console.log('Error:', e.message);
    }
  }

  try {
    // 2. Try to sign in with wrong password (if admin exists)
    console.log('\nTesting wrong password...');
    // We assume admin created in previous steps exists: 'admin@hms.com'
    await axios.post('http://localhost:5000/api/auth/signin', {
      email: 'admin@hms.com',
      password: 'wrongpassword'
    });
  } catch (e) {
    if (e.response) {
      console.log('❌ Status:', e.response.status); // Expect 500
      console.log('❌ Body:', e.response.data);
    } else {
      console.log('Error:', e.message);
    }
  }
}

run();
