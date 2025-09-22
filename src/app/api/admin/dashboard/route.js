import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '../../../../models';

// Helper function for admin authentication
async function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Authentication required', status: 401 };
    }
    
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback_NEXT_PUBLIC_JWT_SECRET_for_development';
    const decoded = jwt.verify(token, jwtSecret);
    
    if (decoded.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }
    
    return { user: decoded };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

// Get dashboard statistics
export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    // Get total orders count
    const totalOrders = await db.Order.count();
    
    // Get pending orders count
    const pendingOrders = await db.Order.count({
      where: { orderStatus: 'pending' }
    });
    
    // Get completed orders count
    const completedOrders = await db.Order.count({
      where: { paymentStatus: 'completed' }
    });
    
    // Get total revenue from completed orders
    const revenueResult = await db.Order.sum('amount', {
      where: { paymentStatus: 'completed' }
    });
    const totalRevenue = revenueResult || 0;
    
    // Get recent orders (last 10)
    const recentOrders = await db.Order.findAll({
      include: [{ association: 'product' }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    // Get orders by day for the last 30 days (for chart data)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const ordersPerDay = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'revenue']
      ],
      where: {
        createdAt: {
          [db.Sequelize.Op.gte]: thirtyDaysAgo
        },
        paymentStatus: 'completed'
      },
      group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']]
    });
    
    // Calculate percentage changes (mock data for now)
    const orderGrowth = totalOrders > 0 ? Math.floor(Math.random() * 20) - 10 : 0; // -10% to +10%
    const revenueGrowth = totalRevenue > 0 ? Math.floor(Math.random() * 25) - 5 : 0; // -5% to +20%
    
    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: parseFloat(totalRevenue).toFixed(2),
        orderGrowth, // percentage change from last period
        revenueGrowth // percentage change from last period
      },
      recentOrders,
      chartData: ordersPerDay.map(item => ({
        date: item.getDataValue('date'),
        orders: parseInt(item.getDataValue('count')),
        revenue: parseFloat(item.getDataValue('revenue') || 0)
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { message: 'Error fetching dashboard statistics' },
      { status: 500 }
    );
  }
}