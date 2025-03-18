import React, { useState } from "react";
import axios from "axios";

const FraudTips = () => {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Retrieve Customer ID from localStorage
  const customerId = localStorage.getItem("customerId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/fraud-tips", { customer_id: customerId });
      setTips(response.data.fraud_tips);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      setTips(null);
      setLoading(false);
    }
  };

  // Function to render the tip categories
  const renderTipSection = (tipSection) => {
    if (!tipSection) return null;
    
    // Handle case where tips might be a string instead of an object
    if (typeof tipSection === 'string') {
      return <p className="mb-2" dangerouslySetInnerHTML={{ __html: tipSection }} />;
    }
    
    return Object.entries(tipSection).map(([key, value]) => {
      // If value is an array, render list items
      if (Array.isArray(value)) {
        return (
          <div key={key} className="mb-6">
            <h3 className="text-lg font-semibold text-unionblue-700 mb-2 capitalize">
              {key.replace(/_/g, ' ')}
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {value.map((item, index) => (
                <li key={index} className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </div>
        );
      }
      
      // If value is an object, render nested sections
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} className="mb-6">
            <h3 className="text-lg font-semibold text-unionblue-700 mb-2 capitalize">
              {key.replace(/_/g, ' ')}
            </h3>
            <div className="pl-4 border-l-2 border-unionaccent-500">
              {renderTipSection(value)}
            </div>
          </div>
        );
      }
      
      // For simple key-value pairs
      return (
        <div key={key} className="mb-4">
          <h3 className="text-md font-medium text-unionblue-700 capitalize">
            {key.replace(/_/g, ' ')}
          </h3>
          <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      );
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-unionblue-700 px-6 py-4">
        <div className="flex items-center">
          <div className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Fraud Prevention Tips</h1>
        </div>
        <p className="text-blue-100 mt-1">Stay informed and protect your financial security</p>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-unionblue-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-unionblue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-unionblue-700">
                Union Bank provides these security tips to help you protect your account. Click the button below to get the latest fraud prevention recommendations.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center w-full md:w-auto bg-unionblue-700 text-white py-3 px-6 rounded-lg hover:bg-unionblue-800 focus:outline-none focus:ring-2 focus:ring-unionblue-600 focus:ring-offset-2 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get Security Tips
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {tips && (
          <div className="mt-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-unionblue-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-unionaccent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Recommendations
              </h2>
              
              <div className="divide-y divide-gray-200">
                {renderTipSection(tips)}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Last updated: March 18, 2025</p>
                  <button className="text-sm text-unionblue-700 hover:text-unionblue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share these tips
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          For assistance with security concerns, please contact our 24/7 fraud helpline at <span className="font-medium text-unionblue-700">1800-XXX-XXXX</span>
        </p>
      </div>
    </div>
  );
};

export default FraudTips;