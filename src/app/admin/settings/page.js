"use client";
import { Suspense } from 'react';
import SettingsPanel from '@/components/admin/SettingsPanel';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div>
                    <a href="/admin/dashboard" className="text-gray-400 hover:text-gray-500">
                      Admin
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-500">Settings</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <main className="py-8">
        <Suspense 
          fallback={
            <div className="max-w-4xl mx-auto p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <SettingsPanel />
        </Suspense>
      </main>
    </div>
  );
}
