import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import OnboardingForm from "./components/OnboardingForm";
import ProfileForm from "./components/ProfileForm";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar"; // Normal user navbar
import BankNavbar from "./components/BankNavbar"; // Bank-side navbar
import ProfilePage from "./components/ProfilesPage";
import ProfileFeedback from "./components/ProfileFeedback";
import TransactionInsights from "./components/TransactionInsights";
import FraudTips from "./components/FraudTips";
import Recommendations from "./components/Recommendations";
import CreateTransaction from "./components/CreateTransaction";
import BankHome from "./components/BankHome";
import CrossBorderDetection from "./components/CrossBorderDetection";
import InsiderThreatDetection from "./components/InsiderThreatDetection";
import UserList from "./components/UserList";
import AdaptiveFraudDetection from "./components/AdaptiveFraudDetection";

import "./App.css";

function App() {
  const location = useLocation(); // Get the current route

  // Check if the current route is a bank-side route
  const isBankRoute =
    location.pathname === "/bank-home" ||
    location.pathname === "/cross-border-detection" ||
    location.pathname === "/insider-threat-detection" ||
    location.pathname === "/adaptive-fraud-detection" ||
    location.pathname === "/user-list";

  return (
    <div>
      {/* Render BankNavbar for bank-side routes, otherwise render Navbar */}
      {isBankRoute ? <BankNavbar /> : <Navbar />}

      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<OnboardingForm />} />
        <Route path="/fraud-tips" element={<FraudTips />} />
        <Route path="/recommendations" element={<Recommendations />} />

        {/* Normal User Routes */}
        <Route path="/profiles" element={<ProfilePage />} />
        <Route path="/risk-assessment" element={<ProfileForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileFeedback />} />
        <Route path="/transactions" element={<TransactionInsights />} />
        <Route path="/create-transaction" element={<CreateTransaction />} />

        {/* Bank-Side Routes */}
        <Route path="/bank-home" element={<BankHome />} />
        <Route path="/cross-border-detection" element={<CrossBorderDetection />} />
        <Route path="/insider-threat-detection" element={<InsiderThreatDetection />} />
        <Route path="/user-list" element={<UserList />} />
        <Route path="/adaptive-fraud-detection" element={<AdaptiveFraudDetection />} />
      </Routes>
    </div>
  );
}

export default App;