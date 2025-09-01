'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CountdownTimer() {
  // Product details with default values
  const [productDetails, setProductDetails] = useState({
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

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    // Set end date to June 30, 2024
    const target = new Date(2024, 5, 30); // Month is 0-indexed, so 5 = June

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      // Check if we're in the last 3 days
      if (difference < 3 * 24 * 60 * 60 * 1000) {
        setIsExpiring(true);
      } else {
        setIsExpiring(false);
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(d);

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setHours(h);

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setMinutes(m);

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setSeconds(s);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to add leading zeros
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Pulsing border effect for urgency */}
          <div className={`${isExpiring ? 'animate-pulse' : ''} border-2 border-red-500 rounded-2xl p-0.5`}>
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                  <span className="inline-block animate-pulse bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    অফার শেষ হতে বাকি
                  </span>
                </h2>
                <p className="text-gray-400">{productDetails.validUntil} পর্যন্ত {productDetails.discount}% ছাড়</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="relative">
                  {/* Glowing effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-gray-900 text-white rounded-xl p-4 w-24 h-28 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold font-mono">{formatNumber(days)}</div>
                    <div className="text-xs uppercase tracking-wider mt-2 text-gray-400">দিন</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-gray-900 text-white rounded-xl p-4 w-24 h-28 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold font-mono">{formatNumber(hours)}</div>
                    <div className="text-xs uppercase tracking-wider mt-2 text-gray-400">ঘন্টা</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-gray-900 text-white rounded-xl p-4 w-24 h-28 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold font-mono">{formatNumber(minutes)}</div>
                    <div className="text-xs uppercase tracking-wider mt-2 text-gray-400">মিনিট</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-gray-900 text-white rounded-xl p-4 w-24 h-28 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold font-mono animate-pulse">{formatNumber(seconds)}</div>
                    <div className="text-xs uppercase tracking-wider mt-2 text-gray-400">সেকেন্ড</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <div className="mb-6">
                  <p className="text-lg text-white mb-2">মূল্য: <span className="line-through text-gray-400">{productDetails.originalPrice}৳</span></p>
                  <p className="text-3xl font-bold text-white">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      মাত্র {productDetails.currentPrice}৳
                    </span>
                  </p>
                </div>
                
                <Link href="/purchase" className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/30 animate-bounce">
                  এখনই কিনুন
                </Link>
                
                <p className="mt-4 text-sm text-gray-400">* সীমিত সময়ের অফার, {productDetails.validUntil} পর্যন্ত</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}