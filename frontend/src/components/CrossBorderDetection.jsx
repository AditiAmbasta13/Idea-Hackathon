import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [formData, setFormData] = useState({
    Account_Type: "",
    Transaction_Amount: "",
    Transaction_Hour: "",
    Transaction_Type: "",
    Device_Used: "",
    Location: "",
    Merchant_Category: "",
    Cross_Border_Flag: "",
    Cross_Border_Country: "",
    Short_Lifespan_Account: "",
    Insider_Threat_Flag: "",
    Regulatory_Flag: "",
    Risk_Category: "",
    Country_Risk_Level: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert numeric fields to numbers
      const numericFields = [
        "Transaction_Amount",
        "Transaction_Hour",
        "Cross_Border_Flag",
        "Short_Lifespan_Account",
        "Country_Risk_Level",
      ];

      const payload = { ...formData };
      for (const field of numericFields) {
        payload[field] = Number(payload[field]);
      }

      console.log("Form data being sent to backend:", payload); // Log the payload
      const response = await axios.post("http://localhost:5000/predict", payload);
      console.log("Response from backend:", response.data); // Log the response
      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze data. Please try again.");
      console.error("Error details:", err.response ? err.response.data : err.message); // Log detailed error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Fraud Detection System</h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <select
              name="Account_Type"
              value={formData.Account_Type}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Account Type</option>
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Amount</label>
            <input
              type="number"
              name="Transaction_Amount"
              value={formData.Transaction_Amount}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Hour (0-23)</label>
            <input
              type="number"
              name="Transaction_Hour"
              value={formData.Transaction_Hour}
              onChange={handleChange}
              min="0"
              max="23"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <select
              name="Transaction_Type"
              value={formData.Transaction_Type}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Transaction Type</option>
              <option value="POS Purchase">POS Purchase</option>
              <option value="Online Purchase">Online Purchase</option>
              <option value="ATM Withdrawal">ATM Withdrawal</option>
              <option value="Wire Transfer">Wire Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Device Used</label>
            <select
              name="Device_Used"
              value={formData.Device_Used}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Device Used</option>
              <option value="Card">Card</option>
              <option value="Mobile">Mobile</option>
              <option value="Desktop">Desktop</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Location</option>
              <option value="Canada">Canada</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Merchant Category</label>
            <select
              name="Merchant_Category"
              value={formData.Merchant_Category}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Merchant Category</option>
              <option value="Grocery">Grocery</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Restaurants">Restaurants</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cross-Border Flag (0 or 1)</label>
            <input
              type="number"
              name="Cross_Border_Flag"
              value={formData.Cross_Border_Flag}
              onChange={handleChange}
              min="0"
              max="1"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cross-Border Country</label>
            <input
              type="text"
              name="Cross_Border_Country"
              value={formData.Cross_Border_Country}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Short Lifespan Account (0 or 1)</label>
            <input
              type="number"
              name="Short_Lifespan_Account"
              value={formData.Short_Lifespan_Account}
              onChange={handleChange}
              min="0"
              max="1"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insider Threat Flag (0 or 1)</label>
            <input
              type="number"
              name="Insider_Threat_Flag"
              value={formData.Insider_Threat_Flag}
              onChange={handleChange}
              min="0"
              max="1"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Regulatory Flag (0 or 1)</label>
            <input
              type="number"
              name="Regulatory_Flag"
              value={formData.Regulatory_Flag}
              onChange={handleChange}
              min="0"
              max="1"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Risk Category</label>
            <select
              name="Risk_Category"
              value={formData.Risk_Category}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Risk Category</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country Risk Level (0-4)</label>
            <input
              type="number"
              name="Country_Risk_Level"
              value={formData.Country_Risk_Level}
              onChange={handleChange}
              min="0"
              max="4"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {/* Display Results */}
        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Analysis Results</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Prediction:</strong> {result.prediction_label}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Explanation:</strong> {result.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Display Error */}
        {error && (
          <div className="mt-8 bg-red-100 p-4 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;