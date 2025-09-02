import { NextResponse } from 'next/server';
import axios from 'axios';
import { getOrFetchToken } from '@/utils/redisTokenManager';
// Removed db import for demo mode

// bKash API configuration
const bkashConfig = {
  baseURL: process.env.NEXT_PUBLIC_BKASH_BASE_URL,
  app_key: process.env.NEXT_PUBLIC_BKASH_APP_KEY,
  app_secret: process.env.NEXT_PUBLIC_BKASH_APP_SECRET,
  username: process.env.NEXT_PUBLIC_BKASH_USERNAME,
  password: process.env.NEXT_PUBLIC_BKASH_PASSWORD
};

console.log('bKash config:', {
  baseURL: bkashConfig.baseURL,
  app_key: bkashConfig.app_key ? '***' : undefined,
  app_secret: bkashConfig.app_secret ? '***' : undefined,
  username: bkashConfig.username ? '***' : undefined,
  password: bkashConfig.password ? '***' : undefined
});

// Function to fetch a new bKash token
async function fetchNewToken() {
  const response = await axios.post(`${bkashConfig.baseURL}/token/grant`, {
    app_key: bkashConfig.app_key,
    app_secret: bkashConfig.app_secret
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'username': bkashConfig.username,
      'password': bkashConfig.password
    }
  });
  
  return response.data.id_token;
}

// Get bKash auth token with Redis caching
async function getBkashToken() {
  try {
    // Use the utility function to get or fetch token
    return await getOrFetchToken('bkash_token', fetchNewToken, 3600);
  } catch (error) {
    console.error('Error getting bKash token:', error.response?.data || error.message);
    throw new Error('Failed to get bKash token');
  }
}

// Create payment
export async function POST(request) {
  try {
    const orderData = await request.json();
    
    // Validate required fields based on Order model
    if (!orderData.customerName || !orderData.customerEmail || !orderData.customerMobile) {
      return NextResponse.json(
        { message: 'Required customer information is missing' },
        { status: 400 }
      );
    }

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Demo mode: Create order object based on Order model structure
    const order = {
      id: orderId,
      customerName: orderData.customerName,
      customerAddress: orderData.customerAddress || '',
      customerMobile: orderData.customerMobile,
      customerEmail: orderData.customerEmail,
      amount: orderData.amount || 999.00,
      paymentMethod: orderData.paymentMethod || 'bKash',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: {
        name: orderData.productName || 'Premium Package',
        id: orderData.productId || 1
      }
    };

    // Get bKash token
    const token = await getBkashToken();
    console.log(token);
    
    console.log('Creating payment payload:', {
      amount: Number(order.amount).toFixed(2),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: `INV-${order.id}`,
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/bkash/callback`,
      payerReference: "BDMouza"
    });

    const paymentResponse = await axios.post(
      `${bkashConfig.baseURL}/create`,
      {
        mode: "0011", // required
        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/bkash/callback`,
        amount: Number(order.amount).toFixed(2), // must be string with 2 decimals
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: `INV-${order.id}`,
        payerReference: "BD Mouza" // same as Python example
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // your getBkashToken() result
          "X-APP-Key": bkashConfig.app_key,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    console.log("bKash Create Payment Response:", paymentResponse.data);

    // Demo mode: In a real app, we would update the order with payment ID
    // No database update in demo mode

    return NextResponse.json({
      paymentID: paymentResponse.data.paymentID,
      createTime: paymentResponse.data.createTime,
      orgLogo: paymentResponse.data.orgLogo,
      orgName: paymentResponse.data.orgName,
      transactionStatus: paymentResponse.data.transactionStatus,
      amount: paymentResponse.data.amount,
      currency: paymentResponse.data.currency,
      intent: paymentResponse.data.intent,
      merchantInvoiceNumber: paymentResponse.data.merchantInvoiceNumber,
      bkashURL: paymentResponse.data.bkashURL
    });
  } catch (error) {
    console.error('Error creating bKash payment:', error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error creating bKash payment' },
      { status: 500 }
    );
  }
}