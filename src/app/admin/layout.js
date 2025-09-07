'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      // Not logged in, redirect to login page
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } else {
      // Set user data
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, [pathname, router]);

  // If on login page or loading, just render children
  if (pathname === '/admin/login' || loading) {
    return children;
  }

  // If not logged in and not on login page, don't render anything (will redirect)
  if (!user && pathname !== '/admin/login') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const isActive = (path) => {
    return pathname === path ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 bg-indigo-900">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <span className="text-white text-xl font-semibold">Bangladesh Maps Admin</span>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  <Link href="/admin/dashboard" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/dashboard')}`}>
                    <svg className="mr-3 h-6 w-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Dashboard
                  </Link>

                  <Link href="/admin/products" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/products')}`}>
                    <svg className="mr-3 h-6 w-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    Products
                  </Link>

                  <Link href="/admin/orders" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/orders')}`}>
                    <svg className="mr-3 h-6 w-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    Orders
                  </Link>

                  <Link href="/admin/settings" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/settings')}`}>
                    <svg className="mr-3 h-6 w-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Settings
                  </Link>
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <svg className="inline-block h-9 w-9 rounded-full text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{user?.username}</p>
                      <button 
                        onClick={handleLogout}
                        className="text-xs font-medium text-indigo-200 hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between bg-indigo-900 shadow-sm">
            <button className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-white text-lg font-semibold pr-4">Bangladesh Maps Admin</div>
          </div>

          {/* Main content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}