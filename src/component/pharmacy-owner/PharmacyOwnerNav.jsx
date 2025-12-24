import React from "react";
import { Link } from "react-router";

const getPharmacyName = () => {
  const userInfo = localStorage.getItem("logged_in_user");
  if (!userInfo) return "Pharmacy";
  try {
    const user = JSON.parse(userInfo);
    return user?.name || "Pharmacy";
  } catch (err) {
    console.error("Failed to parse logged_in_user", err);
    return "Pharmacy";
  }
};

const PharmacyOwnerNav = ({ extraLinks = [], showName = false }) => {
  const handleLogout = () => {
    localStorage.removeItem("logged_in_user");
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  const links = [
    { to: "/", label: "Dashboard" },
    ...extraLinks,
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow py-2">
      <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/medi-Image/MediBear-Main-Logo.png"
            alt="MediBear"
            className="h-10"
          />
        </div>
        <div className="flex items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
          {showName && (
            <Link
              to="/pharmacy/profile"
              className="text-blue-700 hover:text-blue-900 font-medium hover:underline"
              title="Pharmacy profile"
            >
              Hello, {getPharmacyName()}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PharmacyOwnerNav;
