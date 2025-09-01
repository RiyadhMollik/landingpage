export default function FeatureSection() {
  // Product details
  const productDetails = {
    name: "সারা বাংলাদেশের মৌজা ম্যাপ",
    price: 200,
    originalPrice: 15000,
    validUntil: "২০২৪ সালের ৩০ জুন"
  };

  // Features array with icons and descriptions
  const features = [
    {
      title: "উচ্চ মানের মৌজা ম্যাপ",
      description: "আমাদের সমস্ত মৌজা ম্যাপ উচ্চ রেজুলেশনে তৈরি করা হয়েছে, যা আপনাকে সঠিক তথ্য প্রদান করে।",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
        </svg>
      ),
      color: "blue"
    },
    {
      title: "সহজ ডাউনলোড",
      description: "কয়েকটি ক্লিকের মাধ্যমে আপনি সহজেই আমাদের মৌজা ম্যাপগুলি ডাউনলোড করতে পারবেন।",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
      ),
      color: "green"
    },
    {
      title: "ব্যবহারকারী বান্ধব",
      description: "আমাদের মৌজা ম্যাপগুলি সহজেই ব্যবহার করা যায় এবং সমস্ত ডিভাইসে সামঞ্জস্যপূর্ণ।",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
      ),
      color: "purple"
    },
    {
      title: "আজীবন অ্যাকসেস",
      description: "একবার কিনলে আপনি আজীবন আমাদের মৌজা ম্যাপগুলি ব্যবহার করতে পারবেন।",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
        </svg>
      ),
      color: "indigo"
    },
    {
      title: "২৪/৭ সাপোর্ট",
      description: "আমাদের দক্ষ সাপোর্ট টিম সবসময় আপনাকে সাহায্য করতে প্রস্তুত।",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
      color: "yellow"
    },
    {
      title: "সীমিত সময়ের অফার",
      description: `মাত্র ${productDetails.price}৳ - অফার শেষ হবে ${productDetails.validUntil}।`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: "pink"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900" id="features">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block">আমাদের বৈশিষ্ট্য</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
          <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
            {productDetails.name} - সর্বোচ্চ মানের ডিজিটাল মৌজা ম্যাপ সর্বনিম্ন মূল্যে
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative group">
              {/* Glowing border effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              
              <div className="relative p-8 bg-gray-800 rounded-xl transition-all duration-300 transform group-hover:-translate-y-1">
                <div className={`w-14 h-14 bg-${feature.color}-900/30 rounded-full flex items-center justify-center mb-6 border border-${feature.color}-500/50`}>
                  <div className={`text-${feature.color}-400`}>{feature.icon}</div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <a href="/purchase" className={`text-${feature.color}-400 hover:text-${feature.color}-300 flex items-center font-medium`}>
                    <span>আরও জানুন</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="/purchase" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
            মাত্র {productDetails.price}৳ এখনই কিনুন
          </a>
          <p className="mt-4 text-gray-400 text-sm">
            <span className="line-through">{productDetails.originalPrice}৳</span> থেকে {productDetails.price}৳ - {Math.round((productDetails.originalPrice - productDetails.price) / productDetails.originalPrice * 100)}% ছাড়
          </p>
        </div>
      </div>
    </section>
  );
}