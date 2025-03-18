import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OnboardingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaar_number: '',
    pan_number: ''
  });

  const [files, setFiles] = useState({
    aadhaar_doc: null,
    pan_doc: null
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

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      Object.keys(files).forEach(key => {
        if (files[key]) {
          data.append(key, files[key]);
        }
      });
  
      const response = await fetch('http://localhost:5000/customer-onboarding', {
        method: 'POST',
        body: data
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
  
      // Store Customer ID and Name in localStorage
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("customerId", result.customer_id); // Store Customer ID
  
      setResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    navigate('/');
  };

  return (
    <div className="">

      <div className="container mx-auto">
        <div className="bg-white p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Customer Onboarding</h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Form fields */}
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar_number"
                  value={formData.aadhaar_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">PAN Number</label>
                <input
                  type="text"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              <div className="">
                <label className="block text-gray-700 font-semibold mb-2">Aadhaar Document</label>
                <input
                  type="file"
                  name="aadhaar_doc"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              {/* <div className="">
                <label className="block text-gray-700 font-semibold mb-2">PAN Document</label>
                <input
                  type="file"
                  name="pan_doc"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div> */}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 transition duration-200"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Onboarding Result:</h3>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Customer ID</h4>
                    <p className="text-lg">{result.customer_id}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Name</h4>
                    <p className="text-lg">{result.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Email</h4>
                    <p className="text-lg">{result.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">DOB</h4>
                    <p className="text-lg">{result.dob}</p>
                  </div>
                  <p className="text-gray-700">
                    <strong>Aadhaar Verified:</strong> {result.verification_status.aadhaar_verified ? 'Yes' : 'No'}
                  </p>
                  {/* <p className="text-gray-700">
                    <strong>Verification:</strong> {result.verification_explanation}
                  </p> */}
                  <div className={`p-4 rounded-lg ${result.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className={`text-lg font-semibold ${result.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      Status: {result.status}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-xl font-bold text-blue-900 mb-2">Next Steps</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.next_steps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleProceed}
                    className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 transition duration-200"
                  >
                    Proceed to Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default OnboardingForm;