// EPS Payment Gateway Route
import { NextResponse } from 'next/server';
import { initializeEpsPayment } from '../../../../utils/epsPaymentManager.js';
import db from '../../../../models/index.js';

export async function POST(request) {
  try {
    const { orderId, customerData } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('Processing EPS payment for order:', orderId);

    // Get order details from database
    const order = await db.Order.findByPk(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.paymentStatus === 'completed') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      );
    }

    // Prepare order data for EPS
    const orderData = {
      id: order.id,
      amount: order.amount,
      productName: order.productName || 'Digital Product'
    };

    // Initialize EPS payment
    const paymentResult = await initializeEpsPayment(orderData, customerData || {});

    if (!paymentResult.success) {
      throw new Error('Failed to initialize EPS payment');
    }

    // Update order with EPS transaction details
    await order.update({
      gateway: 'eps',
      gatewayTransactionId: paymentResult.transactionId,
      merchantTransactionId: paymentResult.merchantTransactionId,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });

    console.log('✅ EPS payment initialized for order:', orderId);
    console.log('Redirect URL:', paymentResult.redirectURL);

    return NextResponse.json({
      success: true,
      gateway: 'eps',
      transactionId: paymentResult.transactionId,
      merchantTransactionId: paymentResult.merchantTransactionId,
      redirectURL: paymentResult.redirectURL,
      message: 'EPS payment initialized successfully'
    });

  } catch (error) {
    console.error('EPS payment error:', error);
    
    let errorMessage = 'EPS payment initialization failed';
    let statusCode = 500;

    if (error.message.includes('configuration incomplete')) {
      errorMessage = 'EPS payment gateway not configured. Please contact support.';
      statusCode = 503;
    } else if (error.message.includes('Authentication failed')) {
      errorMessage = 'EPS authentication error. Please try again.';
      statusCode = 502;
    } else if (error.message.includes('Invalid response')) {
      errorMessage = 'EPS payment service error. Please try again.';
      statusCode = 502;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        gateway: 'eps',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}