'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PurchasePage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch the single product
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const products = await response.json();
      // Always use the first product
      setProduct(products[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product information');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // First create the order - always using product id 1
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerAddress: 'unknown',
          customerMobile: formData.mobile,
          customerEmail: formData.email,
          productId: 1, // Always use product id 1
          paymentMethod: 'bKash',
          productName: 'সারা বাংলাদেশের মৌজা ম্যাপ'
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Check if we need to redirect to bKash
      if (orderData.redirectToBkash) {
        // Then initiate bKash payment
        const paymentResponse = await fetch('/api/payment/bkash', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData) // Send the complete order data
        });

        if (!paymentResponse.ok) {
          throw new Error('Failed to initiate payment');
        }

        const paymentData = await paymentResponse.json();

        // Redirect to bKash payment URL
        window.location.href = paymentData.bkashURL;
      }

    } catch (error) {
      console.error('Error processing order:', error);
      setError('Failed to process your order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Information Section */}
            <div className="md:w-1/3 bg-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">পণ্যসমূহ</h2>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              ) : product ? (
                <>
                  <div className="mb-6 border-b pb-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-md p-2 mr-3">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.name} × ১</h3>
                        <p className="text-gray-600 text-sm">{product.price}৳</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">সাবটোটাল</span>
                      <span className="font-medium">{product.price}৳</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ডেলিভারি চার্জ</span>
                      <span className="font-medium">০.০০৳</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-800 font-bold">মোট</span>
                      <span className="font-bold text-green-600">{product.price}৳</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">No products available</p>
              )}
            </div>

            {/* Order Form Section */}
            <div className="md:w-2/3 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">ক্রয়ের জন্য আপনার তথ্য দিন</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    আপনার নাম লিখুন <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="সম্পূর্ণ নাম লিখুন"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">
                    আপনার মোবাইল নাম্বর লিখুন <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="১১ ডিজিটের মোবাইল নাম্বর লিখুন"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    আপনার ইমেইল লিখুন <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="আপনি যে মেইলে এসএমএস নিবেন সেটি দিন"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-md transition-colors duration-300 flex justify-center items-center"
                >
                  বিকাশ পেমেন্টের মাধ্যমে পারচেজ সম্পন্ন করুন
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}