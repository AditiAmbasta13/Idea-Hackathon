import React, { useState } from "react";
import axios from "axios";

const ProfileFeedback = () => {
  const [feedback, setFeedback] = useState("");

  // Retrieve Customer ID from localStorage
  const customerId = localStorage.getItem("customerId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/profile-feedback", { customer_id: customerId });
      setFeedback(response.data.profile_feedback);
    } catch (error) {
      setFeedback(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Profile Feedback</h1>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 transition duration-200"
        >
          Get Feedback
        </button>
      </form>
      {feedback && (
        <div className="mt-6 bg-gray-50 p-6 rounded-lg">
          <pre className="text-gray-700">{feedback}</pre>
        </div>
      )}
    </div>
  );
};

export default ProfileFeedback;