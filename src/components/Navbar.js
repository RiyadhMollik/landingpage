'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [product, setProduct] = useState({
    name: 'Bangladesh Maps',
    originalPrice: 500,
    price: 200
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
          setProduct(products[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    
    fetchProduct();
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 text-purple-800">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{product.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline-block text-sm font-medium text-gray-600">Price: <span className="line-through">{product.originalPrice}৳</span> <span className="text-purple-600 font-bold">{product.price}৳</span></span>
          <Link href="/purchase" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Buy Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
