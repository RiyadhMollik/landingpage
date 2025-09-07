// Admin API endpoint to manage settings
import { NextResponse } from 'next/server';
import SettingsService from '@/services/settingsService';

// Get all settings
export async function GET() {
  try {
    const settings = await SettingsService.getSettingsWithDescriptions();
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching settings',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Update settings
export async function PUT(request) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid settings data' 
        },
        { status: 400 }
      );
    }

    // Validate required bKash settings
    const requiredSettings = [
      'bkash_app_key',
      'bkash_app_secret', 
      'bkash_username',
      'bkash_password',
      'bkash_base_url',
      'base_url'
    ];

    for (const key of requiredSettings) {
      if (settings[key] && settings[key].trim() === '') {
        return NextResponse.json(
          { 
            success: false, 
            message: `Setting '${key}' cannot be empty` 
          },
          { status: 400 }
        );
      }
    }

    await SettingsService.updateMultipleSettings(settings);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error updating settings',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Get specific setting
export async function POST(request) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Setting key is required' 
        },
        { status: 400 }
      );
    }

    const value = await SettingsService.getSetting(key);

    return NextResponse.json({
      success: true,
      data: { key, value }
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching setting',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
