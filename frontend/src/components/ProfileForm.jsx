import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ProfileForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const customer_id = location.state?.customer_id || '';

  const [formData, setFormData] = useState({
    customer_id,
    employment_status: 'Employed',
    income: '',
    occupation: '',
    employer: '',
    employment_duration: '',
    monthly_expenses: '',
    education: 'Bachelors',
    marital_status: 'Single',
    existing_loans: []
  });

  const [loanData, setLoanData] = useState({
    amount: '',
    monthly_payment: '',
    loan_type: 'Personal'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoanChange = (e) => {
    setLoanData({
      ...loanData,
      [e.target.name]: e.target.value
    });
  };

  const addLoan = () => {
    if (!loanData.amount || !loanData.monthly_payment) return;
    setFormData({
      ...formData,
      existing_loans: [
        ...formData.existing_loans,
        {
          ...loanData,
          amount: parseFloat(loanData.amount),
          monthly_payment: parseFloat(loanData.monthly_payment)
        }
      ]
    });
    setLoanData({ amount: '', monthly_payment: '', loan_type: 'Personal' });
  };

  const removeLoan = (index) => {
    setFormData({
      ...formData,
      existing_loans: formData.existing_loans.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        ...formData,
        income: parseFloat(formData.income),
        monthly_expenses: parseFloat(formData.monthly_expenses),
        employment_duration: parseFloat(formData.employment_duration)
      };

      const response = await fetch('http://localhost:5000/customer-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setResult(result);

      // Navigate to the dashboard and pass the entire result object
      navigate('/dashboard', { state: { profileData: result } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5'>
      <h2 className="text-xl font-semibold mb-4">Customer Risk Assessment</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Form fields */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Employment Status</label>
            <select
              name="employment_status"
              value={formData.employment_status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Monthly Income (₹)</label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Employer</label>
            <input
              type="text"
              name="employer"
              value={formData.employer}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Employment Duration (years)</label>
            <input
              type="number"
              name="employment_duration"
              value={formData.employment_duration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Monthly Expenses (₹)</label>
            <input
              type="number"
              name="monthly_expenses"
              value={formData.monthly_expenses}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Education</label>
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="High School">High School</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Marital Status</label>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Existing Loans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-gray-700 mb-2">Loan Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={loanData.amount}
                onChange={handleLoanChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Monthly Payment (₹)</label>
              <input
                type="number"
                name="monthly_payment"
                value={loanData.monthly_payment}
                onChange={handleLoanChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Loan Type</label>
              <select
                name="loan_type"
                value={loanData.loan_type}
                onChange={handleLoanChange}
                className="w-full p-2 border rounded"
              >
                <option value="Personal">Personal</option>
                <option value="Home">Home</option>
                <option value="Car">Car</option>
                <option value="Education">Education</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <button
            type="button"
            onClick={addLoan}
            className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 mt-2"
          >
            Add Loan
          </button>
          
          {formData.existing_loans.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Added Loans:</h4>
              <div className="space-y-2">
                {formData.existing_loans.map((loan, index) => (
                  <div key={index} className="flex items-center bg-white p-2 rounded border">
                    <div className="flex-grow">
                      <span className="font-medium">{loan.loan_type}: </span>
                      <span>₹{loan.amount} (₹{loan.monthly_payment}/month)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLoan(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Risk Assessment Result:</h3>
          <div className="bg-white p-4 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Customer ID</h4>
                <p>{result.customer_id}</p>
              </div>
              <div>
                <h4 className="font-medium">Name</h4>
                <p>{result.name}</p>
              </div>
              <div>
                <h4 className="font-medium">Combined Risk Level</h4>
                <p>{result.risk_assessment?.combined_risk_level}</p>
              </div>
              <div>
                <h4 className="font-medium">Combined Risk Score</h4>
                <p>{result.risk_assessment?.combined_risk_score}</p>
              </div>
              <div>
                <h4 className="font-medium">Financial Health</h4>
                <p>{result.risk_assessment?.financial_health}</p>
              </div>
              <div>
                <h4 className="font-medium">Credit Worthiness</h4>
                <p>{result.risk_assessment?.credit_worthiness}</p>
              </div>
              <div>
                <h4 className="font-medium">Debt-to-Income Ratio</h4>
                <p>{result.risk_assessment?.debt_to_income_ratio}%</p>
              </div>
              <div>
                <h4 className="font-medium">Recommended Credit Limit</h4>
                <p>₹{result.recommended_credit_limit}</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">AI Risk Assessment Summary</h4>
              <p className="text-sm text-gray-700">{result.ai_risk_assessment_summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileForm;