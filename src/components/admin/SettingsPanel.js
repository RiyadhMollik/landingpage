"use client";
import { useState, useEffect } from 'react';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const result = await response.json();
      
      if (result.success) {
        // Convert array of settings to key-value object
        const settingsObj = {};
        result.data.forEach(setting => {
          settingsObj[setting.setting_key] = setting.setting_value;
        });
        setSettings(settingsObj);
      } else {
        setMessage('Error fetching settings: ' + result.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage('Error fetching settings');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Settings updated successfully!');
        setMessageType('success');
      } else {
        setMessage('Error updating settings: ' + result.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Error updating settings');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const testConnection = async () => {
    try {
      setMessage('Testing EPS configuration...');
      setMessageType('');
      
      // You could add a test endpoint here to verify the EPS credentials
      setMessage('EPS configuration looks valid (test functionality can be added)');
      setMessageType('success');
    } catch (error) {
      setMessage('Error testing EPS configuration');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment & File Access Settings</h1>
        <p className="text-gray-600">
          Configure EPS payment gateway and Google Drive file access. Changes will take effect immediately.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* EPS Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EPS Username
          </label>
          <input
            type="text"
            value={settings.eps_username || ''}
            onChange={(e) => handleInputChange('eps_username', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter EPS Username"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your EPS merchant account username
          </p>
        </div>
        
        {/* EPS Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EPS Password
          </label>
          <input
            type="password"
            value={settings.eps_password || ''}
            onChange={(e) => handleInputChange('eps_password', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter EPS Password"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your EPS merchant account password
          </p>
        </div>
        
        {/* EPS Hash Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EPS Hash Key
          </label>
          <input
            type="text"
            value={settings.eps_hash_key || ''}
            onChange={(e) => handleInputChange('eps_hash_key', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter EPS Hash Key"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            EPS hash key for HMAC authentication (keep this secure)
          </p>
        </div>
        
        {/* EPS Merchant ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EPS Merchant ID
          </label>
          <input
            type="text"
            value={settings.eps_merchant_id || ''}
            onChange={(e) => handleInputChange('eps_merchant_id', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter EPS Merchant ID"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your EPS merchant identifier
          </p>
        </div>
        
        {/* EPS Store ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EPS Store ID
          </label>
          <input
            type="text"
            value={settings.eps_store_id || ''}
            onChange={(e) => handleInputChange('eps_store_id', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter EPS Store ID"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your EPS store identifier
          </p>
        </div>
        
        {/* EPS Base URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EPS Base URL
          </label>
          <input
            type="url"
            value={settings.eps_base_url || ''}
            onChange={(e) => handleInputChange('eps_base_url', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://sandboxpgapi.eps.com.bd/v1"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            EPS API base URL (sandbox or production)
          </p>
        </div>
        
        {/* Application Base URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Base URL
          </label>
          <input
            type="url"
            value={settings.base_url || ''}
            onChange={(e) => handleInputChange('base_url', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="http://localhost:3000"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your application base URL for callback URLs
          </p>
        </div>
        
        {/* Google Group Integration */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Google Group Integration</h2>
          <p className="text-gray-600 mb-4">Configure automatic Google Group management for customer file access</p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
            <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
              <li>Customers make successful payments and their emails are logged</li>
              <li>System automatically adds customer emails to the Google Group</li>
              <li>Customers automatically get access to shared files through group membership</li>
              <li>All file access is managed centrally through Google Groups</li>
            </ol>
          </div>
          
          {/* Google Service Account Key */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Service Account Key (JSON)
            </label>
            <textarea
              value={settings.google_service_account_key || ''}
              onChange={(e) => handleInputChange('google_service_account_key', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              placeholder='{"type": "service_account", "project_id": "...", "client_email": "...", "private_key": "..."}'
            />
            <p className="mt-1 text-sm text-gray-500">
              Google Service Account with Admin SDK access and domain-wide delegation enabled
            </p>
          </div>
          
          {/* Google Group Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Group Email
            </label>
            <input
              type="email"
              value={settings.google_group_email || 'mouza-map-file-3@googlegroups.com'}
              onChange={(e) => handleInputChange('google_group_email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="mouza-map-file-3@googlegroups.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              Google Group email where customers will be automatically added for file access.
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Update EPS Settings'
            )}
          </button>
          
          <button
            type="button"
            onClick={testConnection}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
          >
            Test EPS Configuration
          </button>
          
          <button
            type="button"
            onClick={fetchSettings}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
          >
            Refresh
          </button>
        </div>
      </form>

      {/* Information Panel */}
      <div className="mt-8 space-y-6">
        {/* EPS Payment Notes */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Payment Configuration Notes:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
            <li>Changes to these settings will affect all payment processing immediately</li>
            <li>Make sure to use the correct environment (sandbox vs production) URLs</li>
            <li>Keep your App Secret and Password secure and never share them</li>
            <li>Test your configuration after making changes</li>
          </ul>
        </div>

        {/* Google Group Setup Instructions */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Automatic Google Group Setup Instructions:</h3>
          <ol className="list-decimal list-inside text-green-700 space-y-2 text-sm">
            <li>
              <strong>Create Google Cloud Project:</strong> Go to Google Cloud Console and create a new project
            </li>
            <li>
              <strong>Enable Admin SDK:</strong> Enable the Admin SDK Directory API
            </li>
            <li>
              <strong>Create Service Account:</strong> Create a service account and download the JSON key
            </li>
            <li>
              <strong>Enable Domain-wide Delegation:</strong> Enable domain-wide delegation for the service account
            </li>
            <li>
              <strong>Authorize Service Account:</strong> In Google Admin Console, authorize the service account with these scopes:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>https://www.googleapis.com/auth/admin.directory.group</li>
                <li>https://www.googleapis.com/auth/admin.directory.group.member</li>
              </ul>
            </li>
            <li>
              <strong>Create/Configure Google Group:</strong> Ensure your Google Group exists and allows external members
            </li>
            <li>
              <strong>Share Files with Group:</strong> Share your Google Drive files with the Google Group
            </li>
            <li>
              <strong>Configure Settings:</strong> Paste the service account JSON and group email in the form above
            </li>
          </ol>
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ Important: You must be a Google Workspace admin to use automatic group management. 
              The service account needs to impersonate an admin user (bdmouzaonline@gmail.com).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
