import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "./Button";
import "./CustomerIndex.css";

export default function CustomerIndex() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("address");
  const [profileData, setProfileData] = useState({
    name: "Sumaiya Akter Badhon",
    email: "sumaiya1403@gmail.com",
    phone: "+8801712345678",
    address: "sector-6, Uttara, Dhaka, Bangladesh",
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfileData({ ...formData });
    setEditModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditModalOpen(false);
  };

  // Address data
  const addresses = [
    {
      label: "Home",
      address: "12, Main Street, Dhaka, Bangladesh",
      phone: "+8801712345678",
    },
    {
      label: "Work",
      address: "45, Lake Road, Dhaka, Bangladesh",
      phone: "+8801712345679",
    },
    {
      label: "Parents' House",
      address: "78 Riverbank, Dhaka, Bangladesh",
      phone: "+8801712345680",
    },
    {
      label: "Office Branch",
      address: "9, Commerce St, Dhaka, Bangladesh",
      phone: "+8801712345681",
    },
  ];

  // Payment methods data
  const payments = [
    { type: "Visa ending •••• 1234", details: "Expires 12/26" },
    { type: "bKash (Personal)", details: "+8801712345678" },
    { type: "Nagad", details: "+8801712345679" },
    { type: "Mastercard ending •••• 5678", details: "Expires 08/27" },
  ];

  // Reviews data
  const reviews = [
    {
      pharmacy: "City Pharmacy",
      review: '"Fast delivery and accurate stock info."',
      date: "2025-07-12",
    },
    {
      pharmacy: "HealthPlus",
      review: '"Helpful staff and quick pickup."',
      date: "2025-06-04",
    },
    {
      pharmacy: "Neighborhood Pharmacy",
      review: '"Excellent customer service and accurate stock updates."',
      date: "2025-05-20",
    },
    {
      pharmacy: "MediTrust",
      review: '"Quick pickup and well packed."',
      date: "2025-04-01",
    },
  ];

  // Favorite pharmacies data
  const favorites = [
    {
      name: "City Pharmacy",
      image: "/medi-Image/pharmacy.png",
      address: "12 Main St, Dhaka",
      status: "Open",
      statusColor: "green",
    },
    {
      name: "HealthPlus",
      image: "/medi-Image/nlogo.png",
      address: "45 Lake Rd, Dhaka",
      status: "Open",
      statusColor: "green",
    },
    {
      name: "CareWell Pharmacy",
      image: "/medi-Image/antibio.png",
      address: "8 Market St, Dhaka",
      status: "Closed",
      statusColor: "red",
    },
    {
      name: "Neighborhood Pharmacy",
      image: "/medi-Image/Inhalers.webp",
      address: "7 Hill St, Dhaka",
      status: "Open",
      statusColor: "green",
    },
    {
      name: "Eastside Pharmacy",
      image: "/medi-Image/Vaccines.png",
      address: "3 Hilltop Ave, Dhaka",
      status: "Open",
      statusColor: "green",
    },
  ];

  // SVG Icons
  const EmailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16 12v.01"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
      />
    </svg>
  );

  const PhoneIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6.22-6.22A19.86 19.86 0 012 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12 1.05.36 2.07.72 3.02a2 2 0 01-.45 2.11L9.78 9.78a16 16 0 006.36 6.36l1.27-1.27a2 2 0 012.11-.45c.95.36 1.97.6 3.02.72A2 2 0 0122 16.92z"
      />
    </svg>
  );

  const LocationIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z"
      />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-green-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-screen-2xl mx-auto px-6 py-12 flex-1">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow p-6 md:flex md:items-start md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-900">
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-blue-900">
                {profileData.name}
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                <EmailIcon />
                {profileData.email}
              </p>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <PhoneIcon />
                <input
                  type="text"
                  readOnly
                  value={profileData.phone}
                  className="readonly-input text-sm text-gray-700 w-44"
                />
              </p>
              <p className="text-sm text-gray-600 mt-2 max-w-md">
                {profileData.address}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:flex md:items-center">
            <Button
              buttonText="Edit Info"
              onClick={() => {
                setFormData({ ...profileData });
                setEditModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg p-5 w-full max-w-2xl">
              <header className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-900">
                  Edit profile
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl leading-none"
                >
                  ✕
                </button>
              </header>
              <form className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Mobile number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <div className="mt-8 bg-white rounded-xl shadow">
          {/* Tab Labels */}
          <div className="border-b">
            <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center gap-6">
              {[
                { id: "address", label: "Address book" },
                { id: "pay", label: "Payment option" },
                { id: "review", label: "Review section" },
                { id: "fav", label: "My favorite pharmacy" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm cursor-pointer px-2 py-1 rounded transition ${
                    activeTab === tab.id
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-screen-2xl mx-auto px-6 py-6">
            {/* Address Book Panel */}
            {activeTab === "address" && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  Saved Addresses
                </h2>
                <div className="fixed-grid">
                  {addresses.map((addr, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                      <p className="font-medium">{addr.label}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {addr.address}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{addr.phone}</p>
                      <div className="mt-3 space-x-4">
                        <button className="text-sm text-blue-700 hover:underline cursor-pointer">
                          Set as default
                        </button>
                        <button className="text-sm text-gray-600 hover:underline cursor-pointer">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Panel */}
            {activeTab === "pay" && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  Payment Options
                </h2>
                <div className="fixed-grid">
                  {payments.map((payment, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                      <p className="font-medium">{payment.type}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {payment.details}
                      </p>
                      <div className="mt-3 space-x-4">
                        <button className="text-sm text-gray-600 hover:underline cursor-pointer">
                          Remove
                        </button>
                        <button className="text-sm text-blue-700 hover:underline cursor-pointer">
                          Set default
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Panel */}
            {activeTab === "review" && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  Your Reviews
                </h2>
                <div className="fixed-grid">
                  {reviews.map((review, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                      <p className="font-medium">{review.pharmacy}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        {review.review}
                      </p>
                      <p className="text-sm text-gray-500 mt-3">
                        Posted on {review.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite Pharmacy Panel */}
            {activeTab === "fav" && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  Favorite Pharmacies
                </h2>
                <div className="fixed-grid">
                  {favorites.map((pharmacy, idx) => (
                    <article
                      key={idx}
                      className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transform hover:-translate-y-1 transition"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={pharmacy.image}
                          alt={pharmacy.name}
                          className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2"
                          onError={(e) =>
                            (e.target.src = "/medi-Image/Bear.png")
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                                <span className="truncate">
                                  {pharmacy.name}
                                </span>
                                <span
                                  className="inline-flex items-center"
                                  aria-label="Verified"
                                >
                                  <CheckIcon />
                                </span>
                                <span
                                  className={`ml-1 text-xs font-semibold ${
                                    pharmacy.statusColor === "green"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {pharmacy.status}
                                </span>
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                <LocationIcon />
                                {pharmacy.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <a
                          href="/products"
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-800 rounded-md border border-blue-100 hover:bg-blue-100 transition"
                        >
                          View products
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
