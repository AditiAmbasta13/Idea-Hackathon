import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UnionLogo from "./union_bank_logo.png"; // Ensure you have this image in your project

function BankNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path ? "bg-unionblue-800" : "hover:bg-unionblue-800";
  };

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-50">
      {/* Header with Union Bank Logo */}
      <header className="bg-unionblue-700 text-white py-4">
        <div className="container mx-auto px-4 flex items-center">
          <div className="mr-4">
            <img src={UnionLogo} alt="Union Bank Logo" className="h-10" />
          </div>
          <div>
            <h1 className="text-lg font-bold">UNION BANK OF INDIA</h1>
            <p className="text-sm">Financial Fraud Prevention System</p>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-unionblue-900 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap">
            <li>
              <a
                onClick={() => handleNavigation("/bank-home")}
                className={`block py-3 px-4 cursor-pointer ${isActive("/bank-home")}`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                onClick={() => handleNavigation("/cross-border-detection")}
                className={`block py-3 px-4 cursor-pointer ${isActive("/cross-border-detection")}`}
              >
                Cross-Border Detection
              </a>
            </li>
            <li>
              <a
                onClick={() => handleNavigation("/insider-threat-detection")}
                className={`block py-3 px-4 cursor-pointer ${isActive("/insider-threat-detection")}`}
              >
                Insider Threat Detection
              </a>
            </li>
            <li>
              <a
                onClick={() => handleNavigation("/adaptive-fraud-detection")}
                className={`block py-3 px-4 cursor-pointer ${isActive("/insider-threat-detection")}`}
              >
                Adaptive Fraud Detection
              </a>
            </li>
            <li>
              <a
                onClick={() => handleNavigation("/user-list")}
                className={`block py-3 px-4 cursor-pointer ${isActive("/user-list")}`}
              >
                User List
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default BankNavbar;