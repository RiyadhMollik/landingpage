'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0); // next day 00:00 local time

      const difference = nextMidnight - now;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft(); // initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 text-white">
      {['days', 'hours', 'minutes', 'seconds'].map((unit, index) => (
        <motion.div
          key={unit}
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-br from-purple-500 to-indigo-600 p-2 sm:p-3 md:p-4 rounded-xl shadow-lg">
            {String(timeLeft[unit]).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm mt-1 sm:mt-2 font-medium">
            {unit === 'days' ? 'দিন' : unit === 'hours' ? 'ঘন্টা' : unit === 'minutes' ? 'মিনিট' : 'সেকেন্ড'}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function Banner() {
  const [productDetails, setProductDetails] = useState({
    name: "সারা বাংলাদেশের সকল মৌজা ম্যাপ",
    originalPrice: 15000,
    currentPrice: 200,
    price: 200,
    discount: 97,
    format: "PDF, JPG Format",
    resolution: "High Resolution",
    reviews: 950,
    rating: 5.0,
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
          // Calculate discount percentage
          const discountPercentage = product.originalPrice > 0
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          setProductDetails({
            ...product,
            currentPrice: product.price,
            discount: discountPercentage
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, []);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 bg-gradient-to-b from-gray-900 to-black min-h-screen flex items-center">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
        {/* Left Section: Text and CTA */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 shadow-lg">
            🔥 99% ছাড়! সীমিত সময়ের জন্য
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-white via-gray-100 to-purple-200 bg-clip-text text-transparent ">
            {productDetails.name}
          </h1>
          <p className="text-sm sm:text-base md:text-lg mt-4 sm:mt-6 text-gray-300">
            {productDetails.format} - {productDetails.resolution} Digital Maps
          </p>
          <div className="mt-4 sm:mt-6">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              <span className="line-through text-gray-500 text-lg sm:text-xl md:text-2xl">15000৳</span>{' '}
              <span className="text-white">মাত্র {productDetails.price}৳</span>
            </p>
            <p className="mt-2 sm:mt-3 text-gray-300 text-sm sm:text-base">আজই অর্ডার করুন এবং বিশাল সাশ্রয় করুন!</p>
          </div>
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mt-4 sm:mt-6 space-x-2">
            <span className="text-yellow-400 text-sm sm:text-base">★★★★★</span>
            <span className="text-xs sm:text-sm text-gray-200">{productDetails.rating} ({productDetails.reviews} reviews)</span>
          </div>
          <motion.div className="mt-4 sm:mt-6 flex justify-center lg:justify-start">
            <Link
              href="/purchase"
              className="bg-gradient-to-r animate-bounce from-purple-600 to-indigo-600 text-white font-bold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              মাত্র {productDetails.currentPrice}৳ এখনই কিনুন
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Section: Features and Countdown */}
        <motion.div
          className="lg:w-1/2 mt-6 lg:mt-0 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative max-w-md w-full">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-800/50">
              {/* Countdown Timer */}
              <motion.div
                className="mb-4 sm:mb-6 bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm sm:text-base font-medium text-gray-200 text-center">অফার শেষ হবে:</p>
                <Countdown campaignEndDate={productDetails.campaignEndDate} />
              </motion.div>
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', text: 'স্ক্যান হওয়া ২ লক্ষ ৫০ হাজার মৌজা ম্যাপ', color: 'purple-400' },
                  { icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542-7-4.477 0-8.268-2.943-9.542-7z', text: 'উচ্চ রেজোলিউশন', color: 'indigo-400' },
                  { icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', text: 'সরাসরি ডাউনলোড', color: 'pink-400' },
                  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: 'সীমিত সময়ের অফার', color: 'purple-400' },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-lg flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.3 }}
                  >
                    <svg className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto text-${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                    <p className="mt-2 text-xs sm:text-sm text-center text-gray-200">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}