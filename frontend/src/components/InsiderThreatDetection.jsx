import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [formData, setFormData] = useState({
    role: "",
    department: "",
    is_rbac_violation: 0,
    is_recent_activity: 0,
    is_new_hire: 0,
    is_fraud: 0,
    access_frequency: 0,
    access_volume: 0,
    query_complexity_very_complex: 0,
    data_sensitivity_level_very_high: 0,
    is_resigned: 0,
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
        "is_rbac_violation",
        "is_recent_activity",
        "is_new_hire",
        "is_fraud",
        "access_frequency",
        "access_volume",
        "query_complexity_very_complex",
        "data_sensitivity_level_very_high",
        "is_resigned",
      ];

      const payload = { ...formData };
      for (const field of numericFields) {
        payload[field] = Number(payload[field]);
      }

      console.log("Form data being sent to backend:", payload);
      const response = await axios.post("http://localhost:5000/analyze", payload);
      console.log("Response from backend:", response.data);
      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze data. Please try again.");
      console.error("Error details:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Union Bank color styles
  const styles = {
    // Using Union Bank color palette
    header: "bg-gradient-to-r from-[#003366] to-[#001F40] text-white p-4 rounded-t-lg",
    button: "w-full bg-[#FF9933] text-white py-2 px-4 rounded-md hover:bg-[#E88A2D] focus:outline-none focus:ring-2 focus:ring-[#D17A25]",
    input: "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF9933] focus:border-[#FF9933]",
    label: "block text-sm font-medium text-[#003366]",
    resultHeader: "bg-[#003366] text-white p-3 rounded-t-lg",
    resultBody: "bg-gray-50 p-6 border-2 border-[#003366] rounded-b-lg",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with Union Bank branding */}
        <div className={styles.header}>
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-2xl font-bold">Union Bank - Insider Threat Analysis</h1>
          </div>
        </div>

        <div className="p-8">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={styles.label}>Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={styles.label}>RBAC Violation (0 or 1)</label>
                <input
                  type="number"
                  name="is_rbac_violation"
                  value={formData.is_rbac_violation}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Recent Activity (0 or 1)</label>
                <input
                  type="number"
                  name="is_recent_activity"
                  value={formData.is_recent_activity}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>New Hire (0 or 1)</label>
                <input
                  type="number"
                  name="is_new_hire"
                  value={formData.is_new_hire}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={styles.label}>Fraud (0 or 1)</label>
                <input
                  type="number"
                  name="is_fraud"
                  value={formData.is_fraud}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Access Frequency</label>
                <input
                  type="number"
                  name="access_frequency"
                  value={formData.access_frequency}
                  onChange={handleChange}
                  min="0"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Access Volume</label>
                <input
                  type="number"
                  name="access_volume"
                  value={formData.access_volume}
                  onChange={handleChange}
                  min="0"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={styles.label}>Query Complexity (0 or 1)</label>
                <input
                  type="number"
                  name="query_complexity_very_complex"
                  value={formData.query_complexity_very_complex}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Data Sensitivity (0 or 1)</label>
                <input
                  type="number"
                  name="data_sensitivity_level_very_high"
                  value={formData.data_sensitivity_level_very_high}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Resigned (0 or 1)</label>
                <input
                  type="number"
                  name="is_resigned"
                  value={formData.is_resigned}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Threat Risk"}
            </button>
          </form>

          {/* Display Results */}
          {result && (
            <div className="mt-8">
              <div className={styles.resultHeader}>
                <h2 className="text-xl font-bold">Analysis Results</h2>
              </div>
              <div className={styles.resultBody}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <p className="text-gray-700 text-lg">
                    <strong>Risk Score:</strong> 
                    <span className={`ml-2 px-3 py-1 rounded-full ${
                      result.risk_score > 75 ? "bg-red-100 text-red-800" : 
                      result.risk_score > 50 ? "bg-yellow-100 text-yellow-800" : 
                      "bg-green-100 text-green-800"
                    }`}>
                      {result.risk_score}
                    </span>
                  </p>
                  <p className="text-[#003366] mt-2 md:mt-0">
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border-l-4 border-[#003366] rounded">
                  <p className="text-gray-700">
                    <strong>Explanation:</strong> {result.explanation}
                  </p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-[#003366] border-b-2 border-[#FF9933] pb-1 mb-3">Score Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result.score_breakdown).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                        <strong className="text-[#001F40]">{key}:</strong>
                        <span className={`px-2 py-1 rounded ${
                          value > 7 ? "bg-red-100 text-red-800" : 
                          value > 4 ? "bg-yellow-100 text-yellow-800" : 
                          "bg-green-100 text-green-800"
                        }`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Display Error */}
          {error && (
            <div className="mt-8 bg-red-100 p-4 rounded-lg text-red-700 border-l-4 border-red-500">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-6 text-sm text-gray-500">
        Union Bank Insider Threat Analysis System &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default App;