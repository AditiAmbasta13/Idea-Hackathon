import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="relative"
        style={{
          backgroundImage: 'url("https://www.financialexpress.com/wp-content/uploads/2022/12/bank.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-unionblue-900 bg-opacity-80"></div>
        <div className="relative z-10 py-24 container mx-auto px-4 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-7/12 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Union Bank Fraud Detection System</h2>
              <p className="text-lg mb-6">
                A secure and reliable platform to detect and prevent fraudulent activities in financial transactions across our banking network.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/onboarding')}
                  className="bg-unionaccent-500 text-white px-6 py-3 rounded font-medium hover:bg-unionaccent-600"
                >
                  Register Now
                </button>
                <button className="bg-gray-100 text-unionblue-900 px-6 py-3 rounded font-medium hover:bg-gray-200">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-4/12">
              <div className="bg-white p-6 rounded shadow-md">
                <h3 className="text-unionblue-900 font-bold text-xl mb-4">Important Notice</h3>
                <p className="text-gray-700 mb-4">
                  As per RBI guidelines, all banking institutions are required to implement enhanced fraud detection measures by the end of this fiscal year.
                </p>
                <a href="#" className="text-unionaccent-600 font-medium hover:underline">Read Full Notice →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            {/* <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/004/989/889/small/rupees-indian-currency-symbol-free-vector.jpg" 
              alt="Indian Rupee Symbol" 
              className="h-16 mr-4"
            /> */}
            <h3 className="text-2xl font-bold text-unionblue-900">Fraud Prevention Features</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="bg-white p-6 rounded border-l-4 border-unionblue-600 shadow-sm">
              <div className="mb-4 text-unionblue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">RBI Compliant Security</h4>
              <p className="text-gray-700">
                Implements security protocols in compliance with RBI guidelines to safeguard customer financial data.
              </p>
            </div>
            <div className="bg-white p-6 rounded border-l-4 border-unionblue-600 shadow-sm">
              <div className="mb-4 text-unionblue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Advanced AI Analytics</h4>
              <p className="text-gray-700">
                State-of-the-art AI algorithms detect fraud patterns based on banking transaction data and behavioral analysis.
              </p>
            </div>
            <div className="bg-white p-6 rounded border-l-4 border-unionblue-600 shadow-sm">
              <div className="mb-4 text-unionblue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Real-time Alerts</h4>
              <p className="text-gray-700">
                Instant notifications for suspicious activities allow for immediate intervention and prevention of fraudulent transactions.
              </p>
            </div>
            <div className="bg-white p-6 rounded border-l-4 border-unionblue-600 shadow-sm">
              <div className="mb-4 text-unionblue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Threat Mitigation</h4>
              <p className="text-gray-700">
                Instant notifications for suspicious activities allow for immediate intervention and prevention of fraudulent transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-100 py-12 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-unionblue-900 mb-10">System Performance</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-unionaccent-600 mb-2">99.8%</div>
                <p className="text-sm text-gray-700">Detection Accuracy</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-unionaccent-600 mb-2">5,200+</div>
                <p className="text-sm text-gray-700">Branches Protected</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-unionaccent-600 mb-2">₹2.3B</div>
                <p className="text-sm text-gray-700">Fraud Prevented</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-unionaccent-600 mb-2">24/7</div>
                <p className="text-sm text-gray-700">Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Section with Image */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-unionblue-900 mb-2">Seamless Integration</h3>
          <div className="w-20 h-1 bg-unionaccent-500 mb-8"></div>
          
          <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded shadow-sm">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <img 
                src="https://www.financialexpress.com/wp-content/uploads/2022/12/bank.jpg" 
                alt="Union Bank Digital Banking" 
                className="rounded shadow-md"
              />
            </div>
            <div className="md:w-1/2">
              <h4 className="text-xl font-bold mb-4">Works with Existing Systems</h4>
              <p className="text-gray-700 mb-4">
                Our fraud detection system seamlessly integrates with Union Bank's existing digital banking infrastructure, ensuring a smooth experience for customers while providing enhanced security.
              </p>
              <ul className="space-y-2">
                {["Core Banking System", "Mobile Banking", "Internet Banking", "UPI Payments", "ATM Network"].map((item) => (
                  <li key={item} className="flex items-center">
                    <svg className="w-5 h-5 text-unionaccent-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-unionblue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12">What Our Branches Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-unionblue-700 p-8 rounded shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Branch Manager" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Rajesh Kumar</p>
                  <p className="text-sm opacity-75">Branch Manager, Mumbai</p>
                </div>
              </div>
              <p className="italic">
                "This system has helped us detect and prevent fraudulent transactions effectively. The real-time alerts have saved our customers from significant losses."
              </p>
            </div>
            <div className="bg-unionblue-700 p-8 rounded shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Security Officer" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">Priya Sharma</p>
                  <p className="text-sm opacity-75">Security Officer, Delhi</p>
                </div>
              </div>
              <p className="italic">
                "The AI-powered fraud detection is a game-changer for our security operations. We've seen a 70% reduction in fraudulent activities since implementation."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-unionaccent-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Enhance Your Branch Security?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Register your branch with Union Bank's Fraud Prevention System to meet regulatory requirements and protect your customers' assets.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-white text-unionblue-800 px-8 py-3 rounded font-medium hover:bg-gray-100"
          >
            Begin Registration Process
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;