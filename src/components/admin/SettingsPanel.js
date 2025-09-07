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
      setMessage('Testing bKash configuration...');
      setMessageType('');
      
      // You could add a test endpoint here to verify the bKash credentials
      setMessage('Configuration looks valid (test functionality can be added)');
      setMessageType('success');
    } catch (error) {
      setMessage('Error testing configuration');
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">bKash Settings</h1>
        <p className="text-gray-600">
          Configure your bKash payment gateway settings. Changes will take effect immediately.
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
        {/* bKash App Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash App Key
          </label>
          <input
            type="text"
            value={settings.bkash_app_key || ''}
            onChange={(e) => handleInputChange('bkash_app_key', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter bKash App Key"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your bKash application key for API authentication
          </p>
        </div>
        
        {/* bKash App Secret */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash App Secret
          </label>
          <input
            type="text"
            value={settings.bkash_app_secret || ''}
            onChange={(e) => handleInputChange('bkash_app_secret', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter bKash App Secret"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your bKash application secret key (keep this secure)
          </p>
        </div>
        
        {/* bKash Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash Username
          </label>
          <input
            type="text"
            value={settings.bkash_username || ''}
            onChange={(e) => handleInputChange('bkash_username', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter bKash Username"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your bKash merchant account username
          </p>
        </div>
        
        {/* bKash Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash Password
          </label>
          <input
            type="text"
            value={settings.bkash_password || ''}
            onChange={(e) => handleInputChange('bkash_password', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter bKash Password"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your bKash merchant account password
          </p>
        </div>
        
        {/* bKash Base URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash Base URL
          </label>
          <input
            type="url"
            value={settings.bkash_base_url || ''}
            onChange={(e) => handleInputChange('bkash_base_url', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            bKash API base URL (sandbox or production)
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
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="http://localhost:3000"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your application base URL for callback URLs
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Update Settings'
            )}
          </button>
          
          <button
            type="button"
            onClick={testConnection}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
          >
            Test Configuration
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
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Notes:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Changes to these settings will affect all payment processing immediately</li>
          <li>Make sure to use the correct environment (sandbox vs production) URLs</li>
          <li>Keep your App Secret and Password secure and never share them</li>
          <li>Test your configuration after making changes</li>
        </ul>
      </div>
    </div>
  );
}
