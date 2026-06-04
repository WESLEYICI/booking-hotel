const axios = require('axios');

async function testBooking() {
  try {
    // We need a valid token to test, or we can just mock a request.
    // Let's login first to get a token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@example.com', // Replace with an actual user email if known
      password: 'password123'
    }).catch(() => null);

    let token = '';
    if (loginRes && loginRes.data && loginRes.data.token) {
      token = loginRes.data.token;
    } else {
      // Create a user if login fails
      const registerRes = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      }).catch(e => console.log('Register failed', e.response?.data));
      
      const loginRes2 = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      token = loginRes2.data.token;
    }

    const FormData = require('form-data');
    const form = new FormData();
    form.append('nama', 'Test Booking');
    form.append('email', 'test@example.com');
    form.append('phone_number', '08123456789');
    form.append('name', 'Deluxe Room');
    form.append('check_in', '2026-07-01');
    form.append('check_out', '2026-07-03');
    form.append('harga', '500000');
    form.append('payment_type', 'bank_transfer');

    console.log('Sending booking request...');
    const bookingRes = await axios.post('http://localhost:5000/api/bookings', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Success:', bookingRes.data);
  } catch (err) {
    console.error('Error details:', err.response ? err.response.data : err.message);
  }
}

testBooking();
