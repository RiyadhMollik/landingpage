import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '../../../models';

// Get all products from database
export async function GET() {
  try {
    console.log('API: Fetching products from database');
    
    // Query active products from database
    const products = await db.Product.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`API: Found ${products.length} products`);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Create a new product (admin only)
export async function POST(request) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback_NEXT_PUBLIC_JWT_SECRET_for_development';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Check if user is admin
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Get product data from request
    const productData = await request.json();
    
    // Create product in database
    const product = await db.Product.create(productData);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Error creating product' },
      { status: 500 }
    );
  }
}