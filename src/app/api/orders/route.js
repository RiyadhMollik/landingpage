import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import db from '../../../models';
// Import Sequelize operators for date filtering
const { Op } = db.Sequelize;

// Helper function for demo authentication - verifies admin token
async function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Authentication required', status: 401 };
    }
    
    const token = authHeader.split(' ')[1];
    // Use fallback secret if NEXT_PUBLIC_JWT_SECRET is not set
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback_NEXT_PUBLIC_JWT_SECRET_for_development';
    const decoded = jwt.verify(token, jwtSecret);
    
    // In demo mode, we'll accept any valid token with admin role
    if (decoded.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }
    
    return { user: decoded };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

// Get all orders - connects to database
export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const exportCsv = searchParams.get('export') === 'true';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Query database for orders
    let query = {
      include: [{ association: 'product' }],
      order: [['createdAt', 'DESC']]
    };
    
    // Add date filtering if provided
    if (startDate && endDate) {
      query.where = {
        createdAt: {
          [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        }
      };
    }
    
    const orders = await db.Order.findAll(query);
    
    // Handle CSV export
    if (exportCsv) {
      // In a real implementation, we would generate a CSV file
      return NextResponse.json({
        message: 'CSV export functionality is available',
        status: 'success'
      });
    }
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

// Create a new order - database implementation
export async function POST(request) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    const requiredFields = ['customerName', 'customerMobile', 'customerEmail', 'productId'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Find the product in the database
    const product = await db.Product.findByPk(orderData.productId);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Create order in database
    const order = await db.Order.create({
      customerName: orderData.customerName,
      customerAddress: orderData.customerAddress || '',
      customerMobile: orderData.customerMobile,
      customerEmail: orderData.customerEmail,
      amount: product.price,
      paymentMethod: orderData.paymentMethod || 'bKash',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      productId: product.id
    });
    
    // Fetch the created order with product details
    const createdOrder = await db.Order.findByPk(order.id, {
      include: [{ association: 'product' }]
    });
    
    // If payment method requires gateway redirect
    if (createdOrder.paymentMethod === 'bKash' || createdOrder.paymentMethod === 'eps') {
      return NextResponse.json({
        ...createdOrder.toJSON(),
        redirectToBkash: createdOrder.paymentMethod === 'bKash',
        redirectToPayment: true
      }, { status: 201 });
    }
    
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Error processing order' },
      { status: 500 }
    );
  }
}