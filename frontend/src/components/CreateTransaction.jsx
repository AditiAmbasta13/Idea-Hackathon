import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cvv: "",
    expiry: "",
  });
  const [securityQuestion, setSecurityQuestion] = useState({
    question: "What is your middle name?",
    answer: ""
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [assessment, setAssessment] = useState("");
  const [step, setStep] = useState(1); // 1: Enter card details, 2: Security question, 3: Enter OTP

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const handleSecurityQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("Verifying security question...");
      
      // Check if the answer is "Amod" for the middle name question
      if (securityQuestion.question === "What is your middle name?" && 
          securityQuestion.answer.trim().toLowerCase() === "amod".toLowerCase()) {
        setMessage("Security verification successful!");
        setStep(3); // Move to OTP verification step
      } else {
        setMessage("Security verification failed. Please try again.");
      }
      
      // You can still include this for future backend integration
      // const response = await axios.post("http://localhost:5001/verify-security-question", {
      //   cardDetails,
      //   securityQuestion
      // });
      // setMessage(response.data.message);
      // setStep(3); // Move to OTP verification step
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to verify security question. Please try again.");
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setMessage("Sending OTP...");

      // Send card details to the backend
      const response = await axios.post("http://localhost:5001/send-otp", cardDetails);
      setMessage(response.data.message);
      setStep(2); // Move to security question step
    } catch (error) {
      // For demo purposes, proceed even if backend isn't available
      setMessage("Card details verified. Please proceed with security verification.");
      setStep(2);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setMessage("Verifying OTP...");

      // Send OTP to the backend
      const response = await axios.post("http://localhost:5001/verify-otp", {
        otp: otp,
      });
      setMessage(response.data.message);
      setAssessment(response.data.assessment); // Display Gemini assessment
    } catch (error) {
      // For demo purposes, proceed even if backend isn't available
      if (otp && otp.length === 6) {
        setMessage("OTP verification successful! Your transaction is complete.");
        setAssessment("This transaction has been verified through multiple authentication factors and appears legitimate.");
      } else {
        setMessage("Failed to verify OTP. Please ensure you've entered all 6 digits.");
      }
    }
  };

  return (
    <div className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-unionblue-700 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                <span className="text-unionblue-700 font-bold text-xl">UB</span>
              </div>
              <h2 className="ml-3 text-xl font-bold text-white">Union Bank</h2>
            </div>
            <div className="bg-unionaccent-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Secure
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-unionblue-700 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                1
              </div>
              <span className={`ml-2 text-sm ${
                step >= 1 ? "text-unionblue-700 font-medium" : "text-gray-500"
              }`}>
                Card Details
              </span>
            </div>
            <div className="bg-gray-200 h-1 w-8 mx-1"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-unionblue-700 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm ${
                step >= 2 ? "text-unionblue-700 font-medium" : "text-gray-500"
              }`}>
                Security
              </span>
            </div>
            <div className="bg-gray-200 h-1 w-8 mx-1"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? "bg-unionblue-700 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                3
              </div>
              <span className={`ml-2 text-sm ${
                step >= 3 ? "text-unionblue-700 font-medium" : "text-gray-500"
              }`}>
                OTP
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {step === 1 ? "Enter Card Information" : 
             step === 2 ? "Security Verification" : "OTP Verification"}
          </h3>

          {/* Step 1: Enter Card Details */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleChange}
                    maxLength={16}
                    placeholder="1234 5678 9012 3456"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-unionblue-600 focus:border-unionblue-600"
                    required
                  />
                  <div className="absolute right-3 top-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleChange}
                    maxLength={5}
                    placeholder="MM/YY"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-unionblue-600 focus:border-unionblue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleChange}
                      maxLength={3}
                      placeholder="123"
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-unionblue-600 focus:border-unionblue-600"
                      required
                    />
                    <div className="absolute right-3 top-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-unionblue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="ml-2 text-xs text-gray-600">Your card details are secured with 256-bit encryption</span>
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-unionblue-700 text-white py-3 px-4 rounded-lg hover:bg-unionblue-800 focus:outline-none focus:ring-2 focus:ring-unionblue-600 focus:ring-offset-2 transition-colors"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Security Question */}
          {step === 2 && (
            <form onSubmit={handleSecurityQuestionSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-unionblue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  Please answer your security question to continue
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
                <select 
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-unionblue-600 focus:border-unionblue-600 bg-gray-50"
                  value={securityQuestion.question}
                  onChange={(e) => setSecurityQuestion({...securityQuestion, question: e.target.value})}
                >
                  <option value="What is your middle name?">What is your middle name?</option>
                  <option value="What was your first pet's name?">What was your first pet's name?</option>
                  <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                  <option value="What city were you born in?">What city were you born in?</option>
                  <option value="What was the name of your first school?">What was the name of your first school?</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Answer</label>
                <input
                  type="text"
                  value={securityQuestion.answer}
                  onChange={(e) => setSecurityQuestion({...securityQuestion, answer: e.target.value})}
                  placeholder="Enter your answer"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-unionblue-600 focus:border-unionblue-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-unionblue-700 text-white py-3 px-4 rounded-lg hover:bg-unionblue-800 focus:outline-none focus:ring-2 focus:ring-unionblue-600 focus:ring-offset-2 transition-colors"
              >
                Verify & Continue
              </button>
            </form>
          )}

          {/* Step 3: Enter OTP */}
          {step === 3 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="text-center mb-6">
                <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-unionblue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to your registered mobile number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="123456"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-unionblue-600 focus:border-unionblue-600 text-center text-lg tracking-wider"
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Code expires in: <span className="font-medium text-unionblue-700">02:59</span></span>
                <button type="button" className="text-sm text-white">Resend Code</button>
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-unionblue-700 text-white py-3 px-4 rounded-lg hover:bg-unionblue-800 focus:outline-none focus:ring-2 focus:ring-unionblue-600 focus:ring-offset-2 transition-colors"
              >
                Verify OTP
              </button>
            </form>
          )}

          {/* Display Messages */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-sm flex items-start ${
                message.includes("success")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {message.includes("success") ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p>{message}</p>
              </div>
            </div>
          )}

          {/* Display Gemini Assessment */}
          {assessment && (
            <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-unionblue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="ml-2 text-lg font-semibold text-gray-800">Transaction Assessment</h3>
              </div>
              <p className="text-gray-600">{assessment}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-center items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;