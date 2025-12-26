import React from "react";
import { useNavigate } from "react-router";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("logged_in_user");
    navigate("/");
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-white w-64 border-r border-gray-300 flex flex-col overflow-y-auto">
        <div className="px-6 border-b border-white flex items-center space-x-3">
          <img
            src="/medi-Image/MediBear-Main-Logo.png"
            alt="MediBear Logo"
            className="h-16 w-auto"
          />
        </div>
        <nav className="flex flex-col mt-6 space-y-1 px-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center space-x-3 px-3 py-2 rounded-md bg-blue-100 text-blue-800 font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l18-6-6 18-3-6-6-6z"
              />
            </svg>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/admin/verification")}
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Pharmacy Verification</span>
          </button>
          <button
            onClick={() => navigate("/admin/user-complaints")}
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 9V7a4 4 0 10-8 0v2M7 17h10M10 19h4"
              />
            </svg>
            <span>User Complaints</span>
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1z"
              />
            </svg>
            <span>Orders</span>
          </button>
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7H8m8 4H8m-2 8h12a2 2 0 002-2v-2H4v2a2 2 0 002 2z"
              />
            </svg>
            <span>Users</span>
          </button>
          <button
            onClick={() => navigate("/admin/reports")}
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L6 14.25m0 0L12 8.25m-6 6l3.75-2.75M12 10v4m0 0v4m0-4h3.75a2.25 2.25 0 002.25-2.25v-2.25a4.5 4.5 0 00-9 0v2.25A2.25 2.25 0 0012 14z"
              />
            </svg>
            <span>Complaints Reports</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white h-16 px-8 border-b border-gray-300">
          <h1 className="text-2xl font-semibold text-blue-900">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{adminUser.name || "Admin"}</span>
            <img
              src={
                adminUser.profile_picture ||
                "https://randomuser.me/api/portraits/men/75.jpg"
              }
              alt="Admin"
              className="w-9 h-9 rounded-full border border-gray-300"
            />
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Panels Grid */}
        <main className="flex-1 overflow-auto p-8 bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pharmacy Verification */}
          <section className="bg-white rounded-lg shadow p-5 flex flex-col">
            <h2 className="font-semibold text-blue-900 mb-4">
              Pharmacy Verification
            </h2>
            <p className="text-gray-600 mb-6">
              Approve/Reject new pharmacy applications.
            </p>
            <button
              onClick={() => navigate("/admin/verification")}
              className="self-start bg-linear-to-r from-blue-950 to-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              View Pending
            </button>
          </section>

          {/* User Complaints */}
          <section className="bg-white rounded-lg shadow p-5 flex flex-col">
            <h2 className="font-semibold text-blue-900 mb-4">
              User Complaints
            </h2>
            <p className="text-gray-600 mb-6">
              Review complaints and reports from users.
            </p>
            <button
              onClick={() => navigate("/admin/user-complaints")}
              className="self-start bg-linear-to-r from-blue-950 to-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
            >
              View Complaints
            </button>
          </section>

          {/* Orders */}
          <section className="bg-white rounded-lg shadow p-5 flex flex-col">
            <h2 className="font-semibold text-blue-900 mb-4">Orders</h2>
            <p className="text-gray-600 mb-6">
              Track and manage customer orders.
            </p>
            <button
              onClick={() => navigate("/admin/orders")}
              className="self-start bg-linear-to-r from-blue-950 to-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
            >
              Manage Orders
            </button>
          </section>

          {/* User Management */}
          <section className="bg-white rounded-lg shadow p-5 flex flex-col">
            <h2 className="font-semibold text-blue-900 mb-4">
              User Management
            </h2>
            <p className="text-gray-600 mb-6">
              Suspend or block users and pharmacies.
            </p>
            <button
              onClick={() => navigate("/admin/users")}
              className="self-start bg-linear-to-r from-blue-950 to-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
            >
              View Users
            </button>
          </section>
        </main>

        {/* Footer Nav */}
        <footer className="bg-white border-t border-gray-300 flex justify-around py-3 text-gray-700 text-sm shadow-inner">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex flex-col items-center space-y-1 text-blue-700 font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M3 12l18-6-6 18-3-6-6-6z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/admin/verification")}
            className="flex flex-col items-center space-y-1 hover:text-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Verification</span>
          </button>
          <button
            onClick={() => navigate("/admin/user-complaints")}
            className="flex flex-col items-center space-y-1 hover:text-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M17 9V7a4 4 0 10-8 0v2M7 17h10M10 19h4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Complaints</span>
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex flex-col items-center space-y-1 hover:text-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Orders</span>
          </button>
          <button
            onClick={() => navigate("/admin/users")}
            className="flex flex-col items-center space-y-1 hover:text-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M16 7H8m8 4H8m-2 8h12a2 2 0 002-2v-2H4v2a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Users</span>
          </button>
          <button
            onClick={() => navigate("/admin/reports")}
            className="flex flex-col items-center space-y-1 hover:text-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M9.75 17L6 14.25m0 0L12 8.25m-6 6l3.75-2.75M12 10v4m0 0v4m0-4h3.75a2.25 2.25 0 002.25-2.25v-2.25a4.5 4.5 0 00-9 0v2.25A2.25 2.25 0 0012 14z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Reports</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
