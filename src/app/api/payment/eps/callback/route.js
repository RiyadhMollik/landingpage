// EPS Payment Callback Route
import { NextResponse } from 'next/server';
import { verifyEpsTransaction, processEpsCallback } from '../../../../../utils/epsPaymentManager.js';
import { grantGoogleDriveAccess } from '../../../../../utils/googleDriveService.js';
import db from '../../../../../models/index.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Log the full URL for debugging
    console.log('EPS Callback URL:', request.url);
    console.log('All search parameters:', Object.fromEntries(searchParams.entries()));
    
    // EPS sends parameters with different casing, so we need to check both
    const status = searchParams.get('status') || searchParams.get('Status');
    const merchantTransactionId = searchParams.get('merchantTransactionId') || searchParams.get('MerchantTransactionId');
    const amount = searchParams.get('amount') || searchParams.get('Amount');
    const transactionId = searchParams.get('transactionId') || searchParams.get('EPSTransactionId');
    const errorCode = searchParams.get('errorCode') || searchParams.get('ErrorCode');

    console.log('EPS Callback received:', { 
      status, 
      merchantTransactionId, 
      amount, 
      transactionId, 
      errorCode
    });

    if (!merchantTransactionId) {
      console.error('EPS Callback: Missing merchantTransactionId');
      console.error('Available parameters:', Object.fromEntries(searchParams.entries()));
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/purchase/error?message=Invalid+callback+data`);
    }

    // Find order by merchant transaction ID
    const order = await db.Order.findOne({
      where: { merchantTransactionId: merchantTransactionId }
    });

    if (!order) {
      console.error('EPS Callback: Order not found for transaction:', merchantTransactionId);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/purchase/error?message=Order+not+found`);
    }

    let paymentStatus = 'failed';
    let orderStatus = 'failed';
    let redirectUrl = '/purchase/failed';

    try {
      if (status && (status.toLowerCase() === 'success' || status === 'Success')) {
        // Verify transaction with EPS API
        console.log('Verifying EPS transaction:', merchantTransactionId);
        const verificationResult = await verifyEpsTransaction(merchantTransactionId);

        if (verificationResult.success && verificationResult.status === 'Success') {
          paymentStatus = 'completed';
          orderStatus = 'confirmed';
          redirectUrl = '/purchase/success';
          
          console.log('✅ EPS payment verified and completed');
          console.log('Amount verified:', verificationResult.totalAmount);
        } else {
          console.warn('⚠️ EPS verification failed or status not Success:', verificationResult.status);
          paymentStatus = 'failed';
          orderStatus = 'failed';
          redirectUrl = '/purchase/failed';
        }
      } else if (status === 'cancel') {
        paymentStatus = 'cancelled';
        orderStatus = 'cancelled';
        redirectUrl = '/purchase/cancelled';
        console.log('EPS payment cancelled by user');
      } else {
        // status === 'fail' or any other status
        paymentStatus = 'failed';
        orderStatus = 'failed';
        redirectUrl = '/purchase/failed';
        console.log('EPS payment failed:', status);
      }

    } catch (verificationError) {
      console.error('EPS verification error:', verificationError.message);
      paymentStatus = 'failed';
      orderStatus = 'failed';
      redirectUrl = '/purchase/error';
    }

    // Update order status
    await order.update({
      paymentStatus: paymentStatus,
      orderStatus: orderStatus,
      gatewayResponse: JSON.stringify({
        status,
        merchantTransactionId,
        amount,
        transactionId,
        timestamp: new Date().toISOString()
      })
    });

    console.log(`EPS payment ${paymentStatus} for order ${order.id}`);

    // Redirect to appropriate page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}${redirectUrl}?orderId=${order.id}&gateway=eps`);

  } catch (error) {
    console.error('EPS callback error:', error);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/purchase/error?message=Callback+processing+failed&gateway=eps`);
  }
}

export async function POST(request) {
  try {
    // Handle POST callbacks if EPS sends them
    const callbackData = await request.json();
    console.log('EPS POST callback received:', callbackData);

    // Process similar to GET but with JSON data
    const { merchantTransactionId, status, amount, transactionId } = callbackData;

    if (!merchantTransactionId) {
      return NextResponse.json(
        { error: 'Missing merchantTransactionId' },
        { status: 400 }
      );
    }

    // Find order
    const order = await db.Order.findOne({
      where: { merchantTransactionId: merchantTransactionId }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Process callback data
    const callbackResult = processEpsCallback(callbackData);

    // Update order
    await order.update({
      paymentStatus: callbackResult.paymentStatus,
      orderStatus: callbackResult.orderStatus,
      gatewayResponse: JSON.stringify({
        ...callbackData,
        timestamp: new Date().toISOString()
      })
    });

    console.log(`EPS POST callback processed: ${callbackResult.paymentStatus} for order ${order.id}`);

    return NextResponse.json({
      success: true,
      status: callbackResult.paymentStatus,
      orderId: order.id
    });

  } catch (error) {
    console.error('EPS POST callback error:', error);
    
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}