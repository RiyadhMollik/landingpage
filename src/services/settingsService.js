// Settings service to handle database operations for configuration
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.NEXT_PUBLIC_DB_HOST || 'localhost',
  user: process.env.NEXT_PUBLIC_DB_USER || 'root',
  password: process.env.NEXT_PUBLIC_DB_PASS || '',
  database: process.env.NEXT_PUBLIC_DB_NAME || 'bdmaps_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

class SettingsService {
  /**
   * Get all settings as key-value pairs
   * @returns {Object} Object with setting keys and values
   */
  static async getAllSettings() {
    try {
      const [rows] = await pool.execute('SELECT setting_key, setting_value FROM settings');
      return rows.reduce((acc, row) => {
        acc[row.setting_key] = row.setting_value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching all settings:', error);
      throw error;
    }
  }

  /**
   * Get a specific setting by key
   * @param {string} key - Setting key
   * @returns {string|null} Setting value or null if not found
   */
  static async getSetting(key) {
    try {
      const [rows] = await pool.execute(
        'SELECT setting_value FROM settings WHERE setting_key = ?',
        [key]
      );
      return rows.length > 0 ? rows[0].setting_value : null;
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error);
      throw error;
    }
  }

  /**
   * Update a setting value
   * @param {string} key - Setting key
   * @param {string} value - New setting value
   * @returns {boolean} Success status
   */
  static async updateSetting(key, value) {
    try {
      const [result] = await pool.execute(
        'UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
        [value, key]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  }

  /**
   * Create a new setting
   * @param {string} key - Setting key
   * @param {string} value - Setting value
   * @param {string} description - Optional description
   * @returns {boolean} Success status
   */
  static async createSetting(key, value, description = '') {
    try {
      await pool.execute(
        'INSERT INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
        [key, value, description]
      );
      return true;
    } catch (error) {
      console.error(`Error creating setting ${key}:`, error);
      throw error;
    }
  }

  /**
   * Update multiple settings at once
   * @param {Object} settings - Key-value pairs of settings to update
   * @returns {boolean} Success status
   */
  static async updateMultipleSettings(settings) {
    const connection = await pool.getConnection();
    try {
      // Start transaction
      await connection.beginTransaction();
      
      for (const [key, value] of Object.entries(settings)) {
        await connection.execute(
          'UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
          [value, key]
        );
      }
      
      // Commit transaction
      await connection.commit();
      return true;
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      console.error('Error updating multiple settings:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get bKash configuration from database
   * @returns {Object} bKash configuration object
   */
  static async getBkashConfig() {
    try {
      const settings = await this.getAllSettings();
      
      return {
        baseURL: settings.bkash_base_url || process.env.NEXT_PUBLIC_BKASH_BASE_URL,
        app_key: settings.bkash_app_key || process.env.NEXT_PUBLIC_BKASH_APP_KEY,
        app_secret: settings.bkash_app_secret || process.env.NEXT_PUBLIC_BKASH_APP_SECRET,
        username: settings.bkash_username || process.env.NEXT_PUBLIC_BKASH_USERNAME,
        password: settings.bkash_password || process.env.NEXT_PUBLIC_BKASH_PASSWORD,
        base_url: settings.base_url || process.env.NEXT_PUBLIC_BASE_URL
      };
    } catch (error) {
      console.error('Error fetching bKash config from database:', error);
      
      // Fallback to environment variables
      return {
        baseURL: process.env.NEXT_PUBLIC_BKASH_BASE_URL,
        app_key: process.env.NEXT_PUBLIC_BKASH_APP_KEY,
        app_secret: process.env.NEXT_PUBLIC_BKASH_APP_SECRET,
        username: process.env.NEXT_PUBLIC_BKASH_USERNAME,
        password: process.env.NEXT_PUBLIC_BKASH_PASSWORD,
        base_url: process.env.NEXT_PUBLIC_BASE_URL
      };
    }
  }

  /**
   * Get settings with their descriptions for admin panel
   * @returns {Array} Array of setting objects with key, value, and description
   */
  static async getSettingsWithDescriptions() {
    try {
      const [rows] = await pool.execute(
        'SELECT setting_key, setting_value, description, updated_at FROM settings ORDER BY setting_key'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching settings with descriptions:', error);
      throw error;
    }
  }
}

export default SettingsService;
