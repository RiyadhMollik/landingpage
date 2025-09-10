import { NextResponse } from 'next/server';
import axios from 'axios';
import SettingsService from '@/services/settingsService';
import { getAccessToken } from '@/utils/getBkashToken';
// Removed db import for demo mode

// Get bKash configuration from database
async function getBkashConfig() {
  try {
    return await SettingsService.getBkashConfig();
  } catch (error) {
    console.error('Error getting bKash config from database:', error);
    // Fallback to environment variables
    return {
      baseURL: process.env.NEXT_PUBLIC_BKASH_BASE_URL,
      app_key: process.env.NEXT_PUBLIC_BKASH_APP_KEY,
      app_secret: process.env.NEXT_PUBLIC_BKASH_APP_SECRET,
      username: process.env.NEXT_PUBLIC_BKASH_USERNAME,
      password: process.env.NEXT_PUBLIC_BKASH_PASSWORD,
      base_url: process.env.NEXT_PUBLIC_BASE_URL
    };
  }
}

// Create payment
export async function POST(request) {
  try {
    const orderData = await request.json();
    const bkashConfig = await getBkashConfig();
    
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
    const token = await getAccessToken();
    console.log(token);
    
    console.log('Creating payment payload:', {
      amount: Number(order.amount).toFixed(2),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: `INV-${order.id}`,
      callbackURL: `${bkashConfig.base_url}/api/payment/bkash/callback`,
      payerReference: "BDMouza"
    });

    const paymentResponse = await axios.post(
      `${bkashConfig.baseURL}/create`,
      {
        mode: "0011", // required
        callbackURL: `${bkashConfig.base_url}/api/payment/bkash/callback`,
        amount: Number(order.amount).toFixed(2), // must be string with 2 decimals
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: `INV-${order.id}`,
        payerReference: "BD Mouza" // same as Python example
      },
      {
        headers: {
      // bKash expects the raw id_token (no "Bearer ")
      authorization: token,
      "x-app-key": bkashConfig.app_key,
          "content-type": "application/json",
          "accept": "application/json"
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