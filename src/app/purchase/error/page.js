"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Extract the actual error content into its own component
function PaymentErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorMessage =
    searchParams.get("message") ||
    "পেমেন্ট প্রক্রিয়াকরণে একটি সমস্যা হয়েছে।";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              পেমেন্ট ব্যর্থ হয়েছে
            </h1>
            <p className="text-lg text-gray-600 mb-8">{errorMessage}</p>

            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-700">
                আপনি আবার চেষ্টা করতে পারেন অথবা অন্য পেমেন্ট পদ্ধতি ব্যবহার করতে পারেন।
              </p>
            </div>

            <div className="mt-6 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={() => router.push("/purchase")}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
              >
                আবার চেষ্টা করুন
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
              >
                হোম পেজে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Main page component with Suspense
export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PaymentErrorContent />
    </Suspense>
  );
}
