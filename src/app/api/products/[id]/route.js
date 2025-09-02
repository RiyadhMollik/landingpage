import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/models';

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
    
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return { error: 'User not found', status: 401 };
    }
    
    if (user.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }
    
    return { user };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

// Get a single product
export async function GET(request, { params }) {
  try {
    const product = await db.Product.findByPk(params.id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

// Update a product (admin only)
export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const product = await db.Product.findByPk(params.id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    const productData = await request.json();
    await product.update(productData);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Error updating product' },
      { status: 500 }
    );
  }
}

// Delete a product (admin only)
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const product = await db.Product.findByPk(params.id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    await product.destroy();
    
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 }
    );
  }
}