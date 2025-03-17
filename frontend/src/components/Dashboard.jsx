import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const profileData = location.state?.profileData || {};
  const [showPopup, setShowPopup] = useState(false);

  // Show popup if the onboarding was successful
  useEffect(() => {
    if (profileData.status === 'success') {
      setShowPopup(true);
    }
  }, [profileData]);

  // Handle proceed to home
  const handleProceed = () => {
    setShowPopup(false);
    navigate('/');
  };

  // Handle high-risk scenario
  const handleHighRisk = () => {
    alert('Your account requires manual review. Please contact support.');
  };

  // Data for charts
  const riskData = [
    { name: 'Combined Risk Score', value: profileData.risk_assessment?.combined_risk_score || 0 },
    { name: 'Debt-to-Income Ratio', value: profileData.risk_assessment?.debt_to_income_ratio || 10 },
  ];

  const creditData = [
    { name: 'Credit Worthiness', value: profileData.risk_assessment?.credit_worthiness === 'Fair' ? 1 : 0 },
    { name: 'Financial Health', value: profileData.risk_assessment?.financial_health === 'Fair' ? 1 : 0 },
  ];

  const transactionData = [
    { name: 'Groceries', value: 1200 },
    { name: 'Rent', value: 5000 },
    { name: 'Utilities', value: 800 },
    { name: 'Entertainment', value: 300 },
    { name: 'Savings', value: 2000 },
  ];

  const colors = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF0000'];

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Combined Risk Score */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Combined Risk Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Credit and Financial Health */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Credit & Financial Health</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={creditData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {creditData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Transaction Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">Customer ID</h4>
            <p>{profileData.customer_id}</p>
          </div>
          <div>
            <h4 className="font-medium">Name</h4>
            <p>{profileData.name}</p>
          </div>
          <div>
            <h4 className="font-medium">Combined Risk Level</h4>
            <p>{profileData.risk_assessment?.combined_risk_level}</p>
          </div>
          <div>
            <h4 className="font-medium">Combined Risk Score</h4>
            <p>{profileData.risk_assessment?.combined_risk_score}</p>
          </div>
          <div>
            <h4 className="font-medium">Credit Worthiness</h4>
            <p>{profileData.risk_assessment?.credit_worthiness}</p>
          </div>
          <div>
            <h4 className="font-medium">Financial Health</h4>
            <p>{profileData.risk_assessment?.financial_health}</p>
          </div>
          <div>
            <h4 className="font-medium">Debt-to-Income Ratio</h4>
            <p>{profileData.risk_assessment?.debt_to_income_ratio}%</p>
          </div>
          <div>
            <h4 className="font-medium">Recommended Credit Limit</h4>
            <p>₹{profileData.recommended_credit_limit}</p>
          </div>
        </div>
      </div>

      {/* AI Risk Assessment Summary */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-xl font-semibold mb-4">AI Risk Assessment Summary</h3>
        <p className="text-sm text-gray-700">{profileData.ai_risk_assessment_summary}</p>
      </div>

      {/* Popup for Successful Onboarding */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Onboarding Successful!</h3>
            <p className="text-gray-700 mb-6">
              Your account has been successfully onboarded. You can now proceed to the home page.
            </p>
            <button
              onClick={handleProceed}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Proceed to Home
            </button>
          </div>
        </div>
      )}

      {/* High-Risk Notification */}
      {profileData.risk_assessment?.combined_risk_level === 'High' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Manual Review Required</h3>
            <p className="text-gray-700 mb-6">
              Your account has been flagged as high risk. Please contact support for further assistance.
            </p>
            <button
              onClick={handleHighRisk}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;