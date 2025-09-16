// EPS Payment Gateway Management
import axios from 'axios';
import { getEpsToken, generateEpsHash } from './getEpsToken.js';
import SettingsService from '../services/settingsService.js';

/**
 * Initialize EPS payment and get redirect URL
 * @param {Object} orderData - Order information
 * @param {Object} customerData - Customer information
 * @returns {Promise<Object>} Payment initialization response
 */
export async function initializeEpsPayment(orderData, customerData) {
  try {
    // Get EPS configuration and token
    const epsConfig = await SettingsService.getEpsConfig();
    const token = await getEpsToken();
    console.log('Using EPS token:', token);
    
    if (!epsConfig.merchant_id || !epsConfig.store_id) {
      throw new Error('EPS merchant configuration incomplete. Please configure Merchant ID and Store ID in admin panel.');
    }

    // Generate unique transaction ID
    const merchantTransactionId = `EPS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate x-hash for this transaction
    const xHash = generateEpsHash(merchantTransactionId, epsConfig.hash_key);

    // Prepare payment payload
    const paymentPayload = {
      storeId: epsConfig.store_id,
      CustomerOrderId: orderData.id.toString(),
      merchantTransactionId: merchantTransactionId,
      transactionTypeId: 1, // 1 = Web
      financialEntityId: 0,
      transitionStatusId: 0,
      totalAmount: parseFloat(orderData.amount).toFixed(2),
      ipAddress: "103.12.45.69", // You might want to get actual IP
      version: "1",
      successUrl: `${epsConfig.base_url.includes('localhost') ? 'http://localhost:3001' : process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/api/payment/eps/callback?status=success`,
      failUrl: `${epsConfig.base_url.includes('localhost') ? 'http://localhost:3001' : process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/api/payment/eps/callback?status=fail`,
      cancelUrl: `${epsConfig.base_url.includes('localhost') ? 'http://localhost:3001' : process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/api/payment/eps/callback?status=cancel`,
      
      // Customer information
      customerName: customerData.name || "Customer",
      customerEmail: customerData.email || "customer@example.com",
      CustomerAddress: customerData.address || "Dhaka, Bangladesh",
      CustomerAddress2: customerData.address2 || "",
      CustomerCity: customerData.city || "Dhaka",
      CustomerState: customerData.state || "Dhaka",
      CustomerPostcode: customerData.postcode || "1000",
      CustomerCountry: "BD",
      CustomerPhone: customerData.phone || "01700000000",
      
      // Shipment information (can be same as customer)
      ShipmentName: customerData.name || "Customer",
      ShipmentAddress: customerData.address || "Dhaka, Bangladesh",
      ShipmentAddress2: customerData.address2 || "",
      ShipmentCity: customerData.city || "Dhaka",
      ShipmentState: customerData.state || "Dhaka",
      ShipmentPostcode: customerData.postcode || "1000",
      ShipmentCountry: "BD",
      
      // Additional fields
      ValueA: "",
      ValueB: "",
      ValueC: "",
      ValueD: "",
      ShippingMethod: "NO",
      NoOfItem: "1",
      ProductName: orderData.productName || "Digital Product",
      ProductProfile: "general",
      ProductCategory: "Digital",
      
      // Product list (can be expanded for multiple items)
      ProductList: [
        {
          ProductName: orderData.productName || "Digital Product",
          NoOfItem: "1",
          ProductProfile: "general",
          ProductCategory: "Digital",
          ProductPrice: parseFloat(orderData.amount).toFixed(2)
        }
      ]
    };

    console.log('Initializing EPS payment for amount:', orderData.amount);
    console.log('Merchant Transaction ID:', merchantTransactionId);

    // Make API call to initialize payment
    const response = await axios.post(
      `${epsConfig.base_url}/EPSEngine/InitializeEPS`,
      paymentPayload,
      {
        headers: {
          'x-hash': xHash,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );
    console.log('EPS Initialize Payment Response:', response.data);
    
    const { TransactionId, RedirectURL, ErrorMessage, ErrorCode } = response.data;

    if (ErrorCode || ErrorMessage) {
      throw new Error(`EPS Payment Error: ${ErrorMessage || 'Unknown error'} (Code: ${ErrorCode})`);
    }

    if (!TransactionId || !RedirectURL) {
      throw new Error('Invalid response from EPS: Missing TransactionId or RedirectURL');
    }

    console.log('✅ EPS payment initialized successfully');
    console.log('Transaction ID:', TransactionId);
    console.log('Redirect URL:', RedirectURL);

    return {
      success: true,
      transactionId: TransactionId,
      merchantTransactionId: merchantTransactionId,
      redirectURL: RedirectURL,
      gateway: 'eps'
    };

  } catch (error) {
    console.error('❌ EPS payment initialization error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('EPS Authentication failed. Token may be expired.');
    }
    
    if (error.response?.status === 400) {
      throw new Error('EPS Payment request invalid. Please check configuration.');
    }
    
    throw error;
  }
}

/**
 * Verify EPS transaction status
 * @param {string} merchantTransactionId - Merchant transaction ID
 * @returns {Promise<Object>} Transaction verification response
 */
export async function verifyEpsTransaction(merchantTransactionId) {
  try {
    // Get EPS configuration and token
    const epsConfig = await SettingsService.getEpsConfig();
    const token = await getEpsToken();

    // Generate x-hash for verification
    const xHash = generateEpsHash(merchantTransactionId, epsConfig.hash_key);

    console.log('Verifying EPS transaction:', merchantTransactionId);

    // Make API call to verify transaction
    const response = await axios.get(
      `${epsConfig.base_url}/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${merchantTransactionId}`,
      {
        headers: {
          'x-hash': xHash,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const transactionData = response.data;

    if (transactionData.ErrorCode || transactionData.ErrorMessage) {
      throw new Error(`EPS Verification Error: ${transactionData.ErrorMessage || 'Unknown error'} (Code: ${transactionData.ErrorCode})`);
    }

    console.log('✅ EPS transaction verified');
    console.log('Status:', transactionData.Status);
    console.log('Amount:', transactionData.TotalAmount);

    return {
      success: true,
      status: transactionData.Status,
      merchantTransactionId: transactionData.MerchantTransactionId,
      totalAmount: transactionData.TotalAmount,
      transactionDate: transactionData.TransactionDate,
      transactionType: transactionData.TransactionType,
      financialEntity: transactionData.FinancialEntity,
      customerInfo: {
        id: transactionData.CustomerId,
        name: transactionData.CustomerName,
        email: transactionData.CustomerEmail,
        phone: transactionData.CustomerPhone,
        address: transactionData.CustomerAddress
      },
      gateway: 'eps'
    };

  } catch (error) {
    console.error('❌ EPS transaction verification error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error('Transaction not found in EPS system');
    }
    
    throw error;
  }
}

/**
 * Process EPS callback data
 * @param {Object} callbackData - Data from EPS callback
 * @returns {Object} Processed callback information
 */
export function processEpsCallback(callbackData) {
  const { status, merchantTransactionId, amount, transactionId } = callbackData;
  
  return {
    gateway: 'eps',
    status: status, // success, fail, cancel
    merchantTransactionId: merchantTransactionId,
    transactionId: transactionId,
    amount: amount,
    paymentStatus: status === 'success' ? 'completed' : 'failed',
    orderStatus: status === 'success' ? 'confirmed' : (status === 'cancel' ? 'cancelled' : 'failed')
  };
}