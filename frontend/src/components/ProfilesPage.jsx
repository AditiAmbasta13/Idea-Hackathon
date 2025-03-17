import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProfileDetailsPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        // Fetch profile details from the API using the customer ID
        const response = await fetch(`http://localhost:5000/customer-profile/${customerId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchProfileDetails();
    }
  }, [customerId]);

  // Function to determine risk level color
  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return 'bg-gray-200 text-gray-800';
    
    switch(riskLevel.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unionblue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-4xl mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/profiles')}
              className="bg-unionblue-700 text-white px-4 py-2 rounded hover:bg-unionblue-800"
            >
              Return to Profiles
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-2">Profile Not Found</h2>
          <p className="text-gray-600 text-center mb-6">The requested customer profile could not be found.</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/profiles')}
              className="bg-unionblue-700 text-white px-4 py-2 rounded hover:bg-unionblue-800"
            >
              Return to Profiles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-unionblue-700 text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold">{profile.name || 'Customer Profile'}</h1>
                <p className="text-unionblue-200">ID: {profile.customer_id}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(profile.risk_assessment?.combined_risk_level)}`}>
                  {profile.risk_assessment?.combined_risk_level || 'Risk Not Assessed'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-unionblue-700 mb-4 border-b border-gray-200 pb-2">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Occupation</p>
                  <p className="font-medium">{profile.occupation || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Employer</p>
                  <p className="font-medium">{profile.employer || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Employment Status</p>
                  <p className="font-medium">{profile.employment_status || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Employment Duration</p>
                  <p className="font-medium">{profile.employment_duration ? `${profile.employment_duration} years` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Education</p>
                  <p className="font-medium">{profile.education || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Marital Status</p>
                  <p className="font-medium">{profile.marital_status || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-unionblue-700 mb-4 border-b border-gray-200 pb-2">
                Financial Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Monthly Income</p>
                  <p className="font-medium">
                    {profile.income ? `₹${profile.income.toLocaleString()}` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Monthly Expenses</p>
                  <p className="font-medium">
                    {profile.monthly_expenses ? `₹${profile.monthly_expenses.toLocaleString()}` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Debt-to-Income Ratio</p>
                  <p className="font-medium">
                    {profile.risk_assessment?.debt_to_income_ratio ? `${profile.risk_assessment.debt_to_income_ratio}%` : 'Not calculated'}
                  </p>
                </div>
              </div>
            </div>

            {/* Existing Loans Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-unionblue-700 mb-4 border-b border-gray-200 pb-2">
                Existing Loans
              </h2>
              
              {profile.existing_loans && profile.existing_loans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monthly Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profile.existing_loans.map((loan, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{loan.loan_type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{loan.amount.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{loan.monthly_payment.toLocaleString()}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No existing loans recorded</p>
              )}
            </div>

            {/* Risk Assessment Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-unionblue-700 mb-4 border-b border-gray-200 pb-2">
                Risk Assessment
              </h2>
              
              {profile.risk_assessment ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Combined Risk Score</p>
                      <p className="font-medium">{profile.risk_assessment.combined_risk_score || 'Not calculated'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Financial Health</p>
                      <p className="font-medium">{profile.risk_assessment.financial_health || 'Not assessed'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Credit Worthiness</p>
                      <p className="font-medium">{profile.risk_assessment.credit_worthiness || 'Not assessed'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Recommended Credit Limit</h3>
                    <p className="text-2xl font-bold text-unionblue-700">
                      {profile.recommended_credit_limit ? `₹${profile.recommended_credit_limit.toLocaleString()}` : 'Not determined'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Risk assessment not available</p>
              )}
            </div>

            {/* AI Assessment Summary */}
            {profile.ai_risk_assessment_summary && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-unionblue-700 mb-4 border-b border-gray-200 pb-2">
                  AI Risk Assessment Summary
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{profile.ai_risk_assessment_summary}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-8">
              <button
                onClick={() => navigate('/profile-form', { state: { customer_id: profile.customer_id } })}
                className="bg-unionblue-700 text-white px-6 py-2 rounded hover:bg-unionblue-800"
              >
                Update Profile
              </button>
              <button
                onClick={() => navigate('/profiles')}
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded hover:bg-gray-200"
              >
                Back to Profiles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetailsPage;