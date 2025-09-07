import { NextResponse } from 'next/server';
import axios from 'axios';
import { getOrFetchToken } from '@/utils/redisTokenManager';
import SettingsService from '@/services/settingsService';
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

// Get bKash auth token with Redis caching
async function fetchNewToken() {
  const bkashConfig = await getBkashConfig();
  
  console.log('bKash callback config from database:', {
    baseURL: bkashConfig.baseURL,
    app_key: bkashConfig.app_key ? '***' : undefined,
    app_secret: bkashConfig.app_secret ? '***' : undefined,
    username: bkashConfig.username ? '***' : undefined,
    password: bkashConfig.password ? '***' : undefined
  });

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

// Handle bKash payment callback
export async function POST(request) {
  try {
    const { paymentID, status, merchantInvoiceNumber } = await request.json();
    const bkashConfig = await getBkashConfig();

    if (!paymentID) {
      return NextResponse.json(
        { message: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Extract order ID from merchantInvoiceNumber (format: INV-{orderId})
    const orderId = merchantInvoiceNumber ? merchantInvoiceNumber.replace('INV-', '') : null;

    // Demo mode: Use order data with full structure based on Order model
    const order = {
      id: orderId || '12345',
      customerName: 'Demo Customer',
      customerAddress: 'Demo Address',
      customerMobile: '01700000000',
      customerEmail: 'demo@example.com',
      amount: 999.00,
      paymentMethod: 'bKash',
      paymentId: paymentID,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: {
        name: 'Premium Package',
        id: 1
      },
      update: (data) => {
        console.log('Demo mode: Would update order with', data);
        // Update the order object to reflect changes
        Object.assign(order, data);
        order.updatedAt = new Date().toISOString();
        return Promise.resolve(order);
      }
    };

    // If payment was successful, execute the payment
    if (status === 'success') {
      // Get bKash token
      const token = await fetchNewToken();
      const executeResponse = await axios.post(
        `${bkashConfig.baseURL}/payment/execute/${paymentID}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-APP-Key': bkashConfig.app_key,
          },
        }
      );

      console.log('bKash Execute Payment Response:', executeResponse.data);

      if (executeResponse.data.statusCode === '0000') {
        // Payment successful
        await order.update({
          paymentStatus: 'completed',
          orderStatus: 'processing'
        });

        return NextResponse.json({
          success: true,
          redirectUrl: `${bkashConfig.base_url}/purchase/success?trxID=` + executeResponse.data.trxID,
          transactionId: executeResponse.data.trxID
        });
      } else {
        // Payment execution failed
        await order.update({
          paymentStatus: 'failed',
          orderStatus: 'cancelled'
        });

        return NextResponse.json({
          success: false,
          redirectUrl: `${bkashConfig.base_url}/purchase/failed?message=Payment execution failed`,
          error: executeResponse.data
        }, { status: 400 });
      }
    } else if (status === 'cancel' || status === 'failure') {
      // Payment cancelled or failed
      await order.update({
        paymentStatus: 'failed',
        orderStatus: 'cancelled'
      });

      return NextResponse.json({
        success: false,
        redirectUrl: `${bkashConfig.base_url}/purchase/cancelled`,
        status
      });
    } else {
      // Unknown status
      console.error('Unknown payment status:', status);
      return NextResponse.json({
        success: false,
        redirectUrl: `${bkashConfig.base_url}/purchase/failed?message=Unknown payment status`,
        status
      });
    }
  } catch (error) {
    console.error('Error in POST callback:', error);
    const bkashConfig = await getBkashConfig();
    return NextResponse.json(
      {
        success: false,
        redirectUrl: `${bkashConfig.base_url}/purchase/failed?message=Error processing payment`,
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for bKash callback
export async function GET(request) {
  try {
    const bkashConfig = await getBkashConfig();
    
    // Extract parameters from URL query string
    const url = new URL(request.url);
    const paymentID = url.searchParams.get('paymentID');
    const status = url.searchParams.get('status');
    const signature = url.searchParams.get('signature');
    const merchantInvoiceNumber = url.searchParams.get('merchantInvoiceNumber');

    console.log('bKash GET callback received:', { paymentID, status, signature, merchantInvoiceNumber });

    console.log('bKash config in GET:', {
      baseURL: bkashConfig.baseURL,
      app_key: bkashConfig.app_key ? '***' : undefined
    });

    if (!paymentID) {
      return NextResponse.redirect(new URL(`${bkashConfig.base_url}/purchase/failed?message=Payment ID missing`, request.url));
    }

    // Extract order ID from merchantInvoiceNumber (format: INV-{orderId})
    const orderId = merchantInvoiceNumber ? merchantInvoiceNumber.replace('INV-', '') : null;

    // Demo mode: Use order data with full structure based on Order model
    const order = {
      id: orderId || '12345',
      customerName: 'Demo Customer',
      customerAddress: 'Demo Address',
      customerMobile: '01700000000',
      customerEmail: 'demo@example.com',
      amount: 999.00,
      paymentMethod: 'bKash',
      paymentId: paymentID,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: {
        name: 'Premium Package',
        id: 1
      },
      update: (data) => {
        console.log('Demo mode: Would update order with', data);
        // Update the order object to reflect changes
        Object.assign(order, data);
        order.updatedAt = new Date().toISOString();
        return Promise.resolve(order);
      }
    };

    // Handle different status values
    if (status === 'success') {
      try {
        // Get bKash token
        const token = await fetchNewToken();
        console.log('bKash token obtained:', token);

        const executeResponse = await axios.post(
          `${bkashConfig.baseURL}/payment/execute/${paymentID}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-APP-Key': bkashConfig.app_key,
            },
          }
        );
        console.log('bKash execute response:', executeResponse.data);

        if (executeResponse.data.statusCode === '0000') {
          // Payment successful
          await order.update({
            paymentStatus: 'completed',
            orderStatus: 'processing'
          });

          return NextResponse.redirect(new URL(`${bkashConfig.base_url}/purchase/success?trxID=${executeResponse.data.trxID}`, request.url));
        } else {
          // Payment execution failed
          await order.update({
            paymentStatus: 'failed',
            orderStatus: 'cancelled'
          });

          return NextResponse.redirect(new URL(`${bkashConfig.base_url}/purchase/failed?message=Payment execution failed`, request.url));
        }
      } catch (error) {
        console.error('Error executing bKash payment:', error.response?.data || error.message);
        await order.update({
          paymentStatus: 'failed',
          orderStatus: 'cancelled'
        });
        return NextResponse.redirect(new URL(`${bkashConfig.base_url}/purchase/failed?message=Payment processing error`, request.url));
      }
    } else if (status === 'cancel' || status === 'failure') {
      // Payment cancelled or failed
      await order.update({
        paymentStatus: 'failed',
        orderStatus: 'cancelled'
      });

      return NextResponse.redirect(new URL(`${bkashConfig.base_url}/purchase/cancelled`, request.url));
    } else {
      // Unknown status
      console.error('Unknown payment status:', status);
      return NextResponse.redirect(new URL(`${bkashConfig.base_url}/purchase/failed?message=Unknown payment status`, request.url));
    }
  } catch (error) {
    console.error('Error in GET callback:', error);
    // Fallback to environment variable if database config fails
    const fallbackUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL(`${fallbackUrl}/purchase/failed?message=Error processing payment`, request.url));
  }
}