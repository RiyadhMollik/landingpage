import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '../../../../models';

// Helper function to verify admin authentication
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

// Get a single order from database
export async function GET(request, { params }) {
  try {
    const order = await db.Order.findByPk(params.id, {
      include: [{ association: 'product' }]
    });
    
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Error fetching order' },
      { status: 500 }
    );
  }
}

// Update an order (admin only)
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }
    
    // Get the order data from request body
    const updateData = await request.json();
    
    // Find the order
    const order = await db.Order.findByPk(params.id);
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update the order
    await order.update(updateData);
    
    // Return the updated order with product details
    const updatedOrder = await db.Order.findByPk(params.id, {
      include: [{ association: 'product' }]
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Error updating order' },
      { status: 500 }
    );
  }
}