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
    window.location.href = "/login";
  };

  const links = [
    { to: "/", label: "Dashboard" },
    ...extraLinks,
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
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
          <span
            className="text-gray-600 hover:text-blue-600"
            title="Pharmacy profile"
          >
            {getPharmacyName()}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default PharmacyOwnerNav;
