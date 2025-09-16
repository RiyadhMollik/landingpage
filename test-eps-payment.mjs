// Test EPS payment with updated credentials
import axios from 'axios';

async function testEpsPayment() {
  console.log('🧪 Testing EPS payment flow...');
  
  try {
    // First create an order
    console.log('1️⃣ Creating order...');
    const orderResponse = await axios.post('http://localhost:3000/api/orders', {
      customerName: 'Test Customer',
      customerAddress: 'Test Address',
      customerMobile: '01700000000',
      customerEmail: 'test@example.com',
      productId: 1,
      paymentMethod: 'eps',
      productName: 'Test Product'
    });

    console.log('✅ Order created:', orderResponse.data.id);

    // Then test EPS payment
    console.log('2️⃣ Testing EPS payment...');
    const epsResponse = await axios.post('http://localhost:3000/api/payment/eps', {
      orderId: orderResponse.data.id,
      customerData: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '01700000000',
        address: 'Test Address'
      }
    });

    console.log('✅ EPS response:', {
      success: epsResponse.data.success,
      hasURL: !!epsResponse.data.redirectURL,
      transactionId: epsResponse.data.transactionId
    });

    if (epsResponse.data.redirectURL) {
      console.log('🎉 EPS payment URL generated successfully!');
      console.log('URL:', epsResponse.data.redirectURL);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testEpsPayment();