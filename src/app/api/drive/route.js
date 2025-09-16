// Google Group API endpoint for testing and management
import { NextResponse } from 'next/server';
import { grantGoogleDriveAccess, removeFromGoogleGroup, getGoogleGroupInfo } from '../../../utils/googleDriveService.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'groupinfo') {
      // Get Google Group information
      const groupInfo = await getGoogleGroupInfo();
      return NextResponse.json(groupInfo);
    }

    return NextResponse.json({
      error: 'Invalid action. Use ?action=groupinfo to get Google Group information'
    }, { status: 400 });

  } catch (error) {
    console.error('Google Group API error:', error);
    
    return NextResponse.json({
      error: error.message,
      success: false
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action, email, productName } = await request.json();

    if (!action) {
      return NextResponse.json({
        error: 'Action is required'
      }, { status: 400 });
    }

    if (action === 'add') {
      if (!email) {
        return NextResponse.json({
          error: 'Email is required for adding customer to group'
        }, { status: 400 });
      }

      const result = await grantGoogleDriveAccess(email, productName || 'Test Product');
      return NextResponse.json(result);

    } else if (action === 'remove') {
      if (!email) {
        return NextResponse.json({
          error: 'Email is required for removing customer from group'
        }, { status: 400 });
      }

      const result = await removeFromGoogleGroup(email);
      return NextResponse.json(result);

    } else {
      return NextResponse.json({
        error: 'Invalid action. Use "add" to add customer to Google Group or "remove" to remove them'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Google Group processing error:', error);
    
    return NextResponse.json({
      error: error.message,
      success: false
    }, { status: 500 });
  }
}