import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [graphData, setGraphData] = useState({});
  const [flaggedAccounts, setFlaggedAccounts] = useState([]);
  const [riskAnalytics, setRiskAnalytics] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [fraudAnalysis, setFraudAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hardcoded user ID
  const userId = 12345;
  
  // Base URL for API calls
  const API_BASE_URL = 'http://localhost:5000';
  
  // Colors for charts
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  // Fetch all the necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch flagged accounts
        const flaggedResponse = await fetch(`${API_BASE_URL}/flagged_accounts`);
        const flaggedData = await flaggedResponse.json();
        setFlaggedAccounts(flaggedData.flagged_accounts || []);
        
        // Fetch risk analytics
        const riskResponse = await fetch(`${API_BASE_URL}/risk_analytics`);
        const riskData = await riskResponse.json();
        setRiskAnalytics(riskData);
        
        // Fetch feedback data
        const feedbackResponse = await fetch(`${API_BASE_URL}/feedback`);
        const feedbackData = await feedbackResponse.json();
        setFeedbackData(feedbackData);
        
        // Fetch fraud analysis for hardcoded user
        const fraudResponse = await fetch(`${API_BASE_URL}/fraud_analysis?user_id=${userId}`);
        const fraudData = await fraudResponse.json();
        setFraudAnalysis(fraudData);
        
      } catch (err) {
        setError('Failed to fetch data. Please make sure the backend server is running.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to convert object data to array format for charts
  const objectToChartData = (obj) => {
    if (!obj) return [];
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
  };
  
  // Renders a graph image from the backend
  const GraphImage = ({ type }) => {
    const title = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
        <img 
          src={`${API_BASE_URL}/graph/${type}?${new Date().getTime()}`} 
          alt={`${type} graph`} 
          className="w-full h-auto rounded-md"
        />
      </div>
    );
  };
  
  // Dashboard tab content
  const DashboardContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GraphImage type="dau" />
      <GraphImage type="activity_distribution" />
      <GraphImage type="transaction_amount" />
      <GraphImage type="activities_per_user" />
      <GraphImage type="transaction_status" />
      <GraphImage type="transaction_type" />
    </div>
  );
  
  // Fraud Analytics tab content
  const FraudAnalyticsContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Fraud Analysis for User ID: {userId}</h3>
        </div>
        {fraudAnalysis ? (
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
            <p className="font-medium text-gray-700">{fraudAnalysis.fraud_analysis}</p>
          </div>
        ) : (
          <p className="text-gray-600">No fraud analysis available.</p>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Flagged Accounts</h3>
        </div>
        {flaggedAccounts.length > 0 ? (
          <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="space-y-2">
              {flaggedAccounts.map((account, index) => (
                <li key={index} className="flex items-center bg-yellow-50 p-2 rounded-md">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  <span className="text-gray-700">User ID: <span className="font-medium">{account}</span></span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No flagged accounts found.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Transaction Type Distribution</h3>
        </div>
        {riskAnalytics && riskAnalytics.transaction_type_distribution ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={objectToChartData(riskAnalytics.transaction_type_distribution)}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {objectToChartData(riskAnalytics.transaction_type_distribution).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Count']} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No transaction type data available.</p>
          </div>
        )}
      </div>
    </div>
  );
  
  // User Activity tab content
  const UserActivityContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Daily Unique Logins</h3>
        </div>
        {feedbackData && feedbackData.daily_unique_logins ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={objectToChartData(feedbackData.daily_unique_logins)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: 'none' }}
                formatter={(value) => [`${value}`, 'Unique Logins']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="value" name="Unique Logins" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No daily login data available.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Hourly Activity Distribution</h3>
        </div>
        {feedbackData && feedbackData.hourly_activity_distribution ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={objectToChartData(feedbackData.hourly_activity_distribution)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: 'none' }}
                formatter={(value) => [`${value}`, 'Activity Count']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Activity Count" 
                stroke="#10B981" 
                strokeWidth={2}
                activeDot={{ r: 6, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hourly activity data available.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Most Active Users</h3>
        </div>
        {feedbackData && feedbackData.most_active_users ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={objectToChartData(feedbackData.most_active_users)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: 'none' }}
                formatter={(value) => [`${value}`, 'Activity Count']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="value" name="Activity Count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No active user data available.</p>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              
              <h1 className="text-2xl font-bold text-gray-800">Financial Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">User ID: {userId}</span>
              <button className="bg-white hover:bg-gray-100 text-gray-700 py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors duration-200">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="overflow-hidden">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center py-3 px-6 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'dashboard'
                        ? 'border-b-2 border-indigo-600 text-white'
                        : 'text-white hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('fraud')}
                    className={`flex items-center py-3 px-6 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'fraud'
                        ? 'border-b-2 border-indigo-600 text-white'
                        : 'text-white hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${activeTab === 'fraud' ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Fraud Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex items-center py-3 px-6 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'activity'
                        ? 'border-b-2 border-indigo-600 text-white'
                        : 'text-white hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${activeTab === 'activity' ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    User Activity
                  </button>
                </nav>
              </div>
            </div>
            
            <div className="py-2">
              {activeTab === 'dashboard' && <DashboardContent />}
              {activeTab === 'fraud' && <FraudAnalyticsContent />}
              {activeTab === 'activity' && <UserActivityContent />}
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-6">
        <div className="container mx-auto py-4 px-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">Financial Analytics Dashboard © 2025</p>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-100 text-xs font-medium text-indigo-800">
                Version 1.0.0
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                Last updated: Today
              </span>
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default App;