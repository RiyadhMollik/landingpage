"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const transactionId = searchParams.get("trxID");

  useEffect(() => {
    if (transactionId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders?transactionId=${transactionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setOrderDetails(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              অর্ডার সফলভাবে সম্পন্ন হয়েছে!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              আপনার পেমেন্ট সফলভাবে গৃহীত হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
            </p>

            {transactionId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700">
                  লেনদেন আইডি:{" "}
                  <span className="font-semibold">{transactionId}</span>
                </p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center my-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
              </div>
            ) : orderDetails ? (
              <div className="text-left border rounded-md p-4 mb-6">
                <h3 className="font-semibold text-lg mb-2">অর্ডার বিবরণ:</h3>
                <p>
                  <span className="font-medium">নাম:</span>{" "}
                  {orderDetails.customerName}
                </p>
                <p>
                  <span className="font-medium">ঠিকানা:</span>{" "}
                  {orderDetails.customerAddress}
                </p>
                <p>
                  <span className="font-medium">মোবাইল:</span>{" "}
                  {orderDetails.customerMobile}
                </p>
                <p>
                  <span className="font-medium">মোট মূল্য:</span>{" "}
                  {orderDetails.amount}৳
                </p>
              </div>
            ) : null}

            <div className="mt-6">
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
