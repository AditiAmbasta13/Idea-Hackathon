import React from "react";
import { Users, FileText, DollarSign, BarChart2, Shield, Bell } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#003366] text-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#FF9933] rounded-md flex items-center justify-center">
              <span className="text-white font-bold">UB</span>
            </div>
            <h1 className="ml-3 text-2xl font-bold">Union Bank Administrator Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell size={20} className="text-white" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-[#FF9933] rounded-full"></span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#FF9933] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AB</span>
              </div>
              <span className="ml-2 text-white">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Image */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden">
        <img 
          src="https://www.financialexpress.com/wp-content/uploads/2022/12/bank.jpg" 
          alt="Union Bank Banner" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-unionblue-900 bg-opacity-80 flex items-center">
          <div className="px-8 md:px-16">
            <h2 className="text-white text-2xl md:text-3xl font-bold">Securing India's Banking Future</h2>
            <p className="text-white text-sm md:text-base mt-2">Advanced security monitoring and threat detection platform</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white p-6 shadow rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome to Union Bank Operations Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Manage bank operations, monitor transactions, and ensure regulatory compliance efficiently.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <h3 className="font-semibold">₹5.2 Cr</h3>
                  <p className="text-sm text-gray-600">Daily Transactions</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <h3 className="font-semibold">52</h3>
                  <p className="text-sm text-gray-600">Active Branches</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <h3 className="font-semibold">12</h3>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 shadow rounded-lg hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center cursor-pointer">
              <Users className="h-10 w-10 text-blue-600 mb-2" />
              <h3 className="font-medium">Account Management</h3>
              <p className="text-sm text-gray-500 mt-1">Manage customer accounts</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center cursor-pointer">
              <DollarSign className="h-10 w-10 text-green-600 mb-2" />
              <h3 className="font-medium">Transaction Control</h3>
              <p className="text-sm text-gray-500 mt-1">Monitor & approve transactions</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center cursor-pointer">
              <FileText className="h-10 w-10 text-purple-600 mb-2" />
              <h3 className="font-medium">Regulatory Reports</h3>
              <p className="text-sm text-gray-500 mt-1">Generate compliance reports</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center cursor-pointer">
              <BarChart2 className="h-10 w-10 text-orange-600 mb-2" />
              <h3 className="font-medium">Analytics Dashboard</h3>
              <p className="text-sm text-gray-500 mt-1">View performance metrics</p>
            </div>
          </div>
        </div>

        {/* Recent Activities & Alerts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
              <div className="space-y-4">
                {[
                  { type: "approval", text: "New loan application #LN28456 awaiting approval", time: "10 minutes ago" },
                  { type: "alert", text: "Multiple failed login attempts detected at Chennai Branch", time: "25 minutes ago" },
                  { type: "info", text: "System maintenance scheduled for 2:00 AM IST", time: "1 hour ago" },
                  { type: "success", text: "March compliance reports successfully submitted to RBI", time: "2 hours ago" },
                  { type: "info", text: "New policy update: KYC verification process change", time: "3 hours ago" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.type === "approval" ? "bg-yellow-500" : 
                      activity.type === "alert" ? "bg-red-500" : 
                      activity.type === "success" ? "bg-green-500" : "bg-blue-500"
                    }`}></div>
                    <div className="ml-3">
                      <p className="text-gray-700">{activity.text}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm">View All Activities</button>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Regulatory Alerts</h2>
              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-sm font-medium text-red-800">High Priority</p>
                  <p className="text-sm text-gray-700">RBI quarterly report due in 5 days</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-sm font-medium text-yellow-800">Medium Priority</p>
                  <p className="text-sm text-gray-700">Update AML protocols by next week</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-medium text-blue-800">Information</p>
                  <p className="text-sm text-gray-700">New SEBI guidelines for investment products</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm">View All Alerts</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;