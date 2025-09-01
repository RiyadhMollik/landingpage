'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CallToAction() {
  // Product details with default values
  const [productDetails, setProductDetails] = useState({
    name: "সারা বাংলাদেশের মৌজা ম্যাপ",
    originalPrice: 500,
    currentPrice: 200,
    discount: 60,
    validUntil: "২০২৪ সালের ৩০ জুন"
  });
  
  useEffect(() => {
    // Fetch the single product
    async function fetchProduct() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const products = await response.json();
        // Always use the first product
        if (products && products.length > 0) {
          const product = products[0];
          setProductDetails({
            name: product.name,
            originalPrice: product.originalPrice,
            currentPrice: product.price,
            discount: product.discount,
            validUntil: product.validity
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    
    fetchProduct();
  }, []);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 opacity-90"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute h-4 w-4 rounded-full bg-purple-500 opacity-20 animate-float" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="absolute h-6 w-6 rounded-full bg-pink-500 opacity-20 animate-float" style={{ top: '20%', left: '25%', animationDelay: '0.5s' }}></div>
        <div className="absolute h-3 w-3 rounded-full bg-blue-500 opacity-20 animate-float" style={{ top: '60%', left: '15%', animationDelay: '1s' }}></div>
        <div className="absolute h-5 w-5 rounded-full bg-indigo-500 opacity-20 animate-float" style={{ top: '30%', left: '70%', animationDelay: '1.5s' }}></div>
        <div className="absolute h-4 w-4 rounded-full bg-purple-500 opacity-20 animate-float" style={{ top: '70%', left: '85%', animationDelay: '2s' }}></div>
        <div className="absolute h-6 w-6 rounded-full bg-pink-500 opacity-20 animate-float" style={{ top: '40%', left: '40%', animationDelay: '2.5s' }}></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-purple-500/30">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block">
              আজই কিনুন, সীমিত সময়ের অফার!
            </h2>
            
            <div className="mb-8 space-y-4">
              <p className="text-xl text-white">
                {productDetails.name} - সর্বোচ্চ মানের ডিজিটাল মৌজা ম্যাপ সর্বনিম্ন মূল্যে
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-200">উচ্চ রেজুলেশন</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-200">সহজে ব্যবহারযোগ্য</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-200">আজীবন অ্যাকসেস</span>
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <div className="flex items-center justify-center gap-4">
                <span className="text-lg line-through text-gray-400">{productDetails.originalPrice}৳</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {productDetails.currentPrice}৳
                </span>
                <span className="bg-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {productDetails.discount}% ছাড়
                </span>
              </div>
              <p className="text-gray-400 mt-2 text-sm">* অফার শেষ হবে {productDetails.validUntil}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/purchase" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 text-lg">
                এখনই কিনুন
              </Link>
              
              <a href="#features" className="inline-block px-8 py-4 bg-transparent border border-purple-500 text-white font-bold rounded-lg hover:bg-purple-900/30 transition-all duration-300 text-lg">
                আরও জানুন
              </a>
            </div>
            
            <div className="mt-8 flex justify-center items-center space-x-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <span className="text-white">৫০০+ সন্তুষ্ট গ্রাহক</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}