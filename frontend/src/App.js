import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import OnboardingForm from './components/OnboardingForm';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilesPage'
import './App.css';

function App() {
  return (
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<OnboardingForm />} />
            <Route path="/profiles" element={<ProfilePage />} />
            <Route path="/risk-assessment" element={<ProfileForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
  );
}

export default App;