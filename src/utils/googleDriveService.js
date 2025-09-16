// Google Group Service for managing customer access
import { google } from 'googleapis';
import SettingsService from '../services/settingsService.js';

// Initialize Google Admin SDK
let admin = null;
let lastAuthTime = 0;
const AUTH_REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes

async function initializeAdminAPI() {
  try {
    // Check if we need to re-authenticate
    if (admin && Date.now() - lastAuthTime < AUTH_REFRESH_INTERVAL) {
      return admin;
    }

    // Get Google Admin configuration from database
    const settings = await SettingsService.getAllSettings();
    
    const serviceAccountKey = settings.google_service_account_key || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error('Google Service Account key not configured');
    }

    // Parse service account key (it should be a JSON string)
    let credentials;
    try {
      credentials = typeof serviceAccountKey === 'string' 
        ? JSON.parse(serviceAccountKey) 
        : serviceAccountKey;
    } catch (error) {
      throw new Error('Invalid Google Service Account key format');
    }

    // Create JWT auth client with domain-wide delegation
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      [
        'https://www.googleapis.com/auth/admin.directory.group',
        'https://www.googleapis.com/auth/admin.directory.group.member'
      ],
      'bdmouzaonline@gmail.com' // Your admin email for domain-wide delegation
    );

    // Authorize the client
    await auth.authorize();

    // Create Admin SDK instance
    admin = google.admin({ version: 'directory_v1', auth });
    lastAuthTime = Date.now();

    console.log('✅ Google Admin SDK initialized');
    return admin;

  } catch (error) {
    console.error('❌ Failed to initialize Google Admin SDK:', error.message);
    throw error;
  }
}

/**
 * Grant access by automatically adding customer to Google Group
 * @param {string} customerEmail - Customer email address
 * @param {string} productName - Name of the product (for logging)
 * @returns {Promise<Object>} Access grant result
 */
export async function grantGoogleDriveAccess(customerEmail, productName = 'Digital Product') {
  try {
    console.log(`🔑 Processing Google Group access for ${customerEmail} - ${productName}`);

    // Get Google Group email from settings
    const settings = await SettingsService.getAllSettings();
    const googleGroupEmail = settings.google_group_email || process.env.GOOGLE_GROUP_EMAIL || 'mouza-map-file-3@googlegroups.com';

    console.log(`✅ Customer email logged for Google Group addition: ${customerEmail}`);
    console.log(`📧 Google Group: ${googleGroupEmail}`);

    try {
      // Initialize Admin SDK
      const adminAPI = await initializeAdminAPI();

      // Check if user is already a member
      try {
        const existingMember = await adminAPI.members.get({
          groupKey: googleGroupEmail,
          memberKey: customerEmail
        });

        if (existingMember.data) {
          console.log(`✅ User ${customerEmail} is already a member of the group`);
          return {
            success: true,
            message: 'Customer is already a member of the Google Group',
            email: customerEmail,
            googleGroup: googleGroupEmail,
            status: 'already_member'
          };
        }
      } catch (memberCheckError) {
        // User is not a member, continue with adding
        if (memberCheckError.code !== 404) {
          console.warn('Could not check existing membership:', memberCheckError.message);
        }
      }

      // Add customer to Google Group
      const memberData = {
        email: customerEmail,
        role: 'MEMBER' // Can be MEMBER, MANAGER, or OWNER
      };

      const result = await adminAPI.members.insert({
        groupKey: googleGroupEmail,
        resource: memberData
      });

      console.log(`✅ Successfully added ${customerEmail} to Google Group ${googleGroupEmail}`);
      console.log(`📋 Member ID: ${result.data.id}`);

      return {
        success: true,
        message: 'Customer automatically added to Google Group',
        email: customerEmail,
        googleGroup: googleGroupEmail,
        memberId: result.data.id,
        status: 'added_successfully',
        accessGranted: true
      };

    } catch (error) {
      console.error(`❌ Failed to add ${customerEmail} to Google Group:`, error.message);
      
      // Fallback to manual instruction
      console.log(`📋 Manual action required: Add ${customerEmail} to Google Group ${googleGroupEmail}`);
      
      return {
        success: true,
        message: 'Automatic addition failed, manual action required',
        email: customerEmail,
        googleGroup: googleGroupEmail,
        instructions: `Manually add ${customerEmail} to Google Group ${googleGroupEmail} to grant file access.`,
        actionRequired: 'Add customer to Google Group manually',
        error: error.message,
        status: 'manual_required'
      };
    }

  } catch (error) {
    console.error(`❌ Failed to process Google Group access for ${customerEmail}:`, error.message);
    throw new Error(`Google Group processing error: ${error.message}`);
  }
}

/**
 * Remove customer from Google Group
 * @param {string} customerEmail - Customer email address
 * @returns {Promise<Object>} Removal result
 */
export async function removeFromGoogleGroup(customerEmail) {
  try {
    console.log(`🔒 Removing ${customerEmail} from Google Group`);

    const settings = await SettingsService.getAllSettings();
    const googleGroupEmail = settings.google_group_email || process.env.GOOGLE_GROUP_EMAIL || 'mouza-map-file-3@googlegroups.com';

    const adminAPI = await initializeAdminAPI();

    // Remove customer from Google Group
    await adminAPI.members.delete({
      groupKey: googleGroupEmail,
      memberKey: customerEmail
    });

    console.log(`✅ Successfully removed ${customerEmail} from Google Group ${googleGroupEmail}`);

    return {
      success: true,
      message: 'Customer removed from Google Group',
      email: customerEmail,
      googleGroup: googleGroupEmail
    };

  } catch (error) {
    if (error.code === 404) {
      console.log(`ℹ️ User ${customerEmail} is not a member of the group`);
      return {
        success: true,
        message: 'Customer is not a member of the group',
        email: customerEmail
      };
    }

    console.error(`❌ Failed to remove ${customerEmail} from Google Group:`, error.message);
    throw error;
  }
}

/**
 * Get Google Group information from settings
 * @returns {Promise<Object>} Google Group information
 */
export async function getGoogleGroupInfo() {
  try {
    const settings = await SettingsService.getAllSettings();
    const googleGroupEmail = settings.google_group_email || process.env.GOOGLE_GROUP_EMAIL || 'mouza-map-file-3@googlegroups.com';

    return {
      success: true,
      googleGroup: googleGroupEmail,
      message: 'Google Group configuration retrieved successfully'
    };

  } catch (error) {
    console.error('Failed to get Google Group info:', error.message);
    throw error;
  }
}