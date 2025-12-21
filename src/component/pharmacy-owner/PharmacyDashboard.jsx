import React from "react";
import { Link } from "react-router";
import PharmacyOwnerNav from "./PharmacyOwnerNav";

const PharmacyDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <PharmacyOwnerNav showName />

      <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-10 w-full">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-blue-900">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">
              Overview of inventory, orders, complaints and quick summary
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Last updated</div>
            <div className="text-sm text-gray-700">2025-11-17</div>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Inventory Card */}
          <article className="bg-white rounded-xl p-5 shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg">
            <Link
              to="/pharmacy/suppliers"
              className="block h-full"
              aria-label="Open Inventory"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-linear-to-br from-blue-50 to-cyan-50 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    Supplier
                  </div>
                </div>
              </div>
            </Link>
          </article>

          <article className="bg-white rounded-xl p-5 shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg">
            <Link
              to="/pharmacy/inventory"
              className="block h-full"
              aria-label="Open Inventory"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-linear-to-br from-blue-50 to-cyan-50 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    Inventory
                  </div>
                </div>
              </div>
            </Link>
          </article>

          {/* Order Management Card */}
          <article className="bg-white rounded-xl p-5 shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg">
            <Link
              to="/pharmacy/orders"
              className="block h-full"
              aria-label="Open Order Management"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-linear-to-br from-orange-50 to-amber-50 text-amber-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 7h18M3 7l1.5 12.5A2 2 0 006.5 21h11a2 2 0 001.99-1.5L21 7M16 11V7M8 11V7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order Management</p>
                      <div className="text-2xl font-bold text-blue-600">
                        32 New
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      Processing
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    View and update incoming orders, print invoices, manage
                    delivery.
                  </p>
                </div>
              </div>
            </Link>
          </article>

          {/* Complaints Card */}
          <article className="bg-white rounded-xl p-5 shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg">
            <Link
              to="/pharmacy/complaints"
              className="block h-full"
              aria-label="Open Complaints"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-linear-to-br from-red-50 to-rose-50 text-red-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M7 8h10M7 12h6m2 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v6"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Complaints</p>
                      <div className="text-2xl font-bold text-blue-600">
                        7 Open
                      </div>
                    </div>
                    <div className="text-sm text-yellow-600 font-medium">
                      Urgent
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Track customer complaints, respond, and escalate as needed.
                  </p>
                </div>
              </div>
            </Link>
          </article>

          {/* Summary Card */}
          <article className="bg-white rounded-xl p-5 shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg">
            <Link
              to="/pharmacy/summary"
              className="block h-full"
              aria-label="Open Summary"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-linear-to-br from-green-50 to-emerald-50 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M11 3v18M20 7v10M2 13v8"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Summary</p>
                      <div className="text-2xl font-bold text-blue-600">
                        <span className="mr-2 text-lg">৳</span>12,430
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Monthly</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Quick financial snapshot and sales performance this month.
                  </p>
                </div>
              </div>
            </Link>
          </article>
        </section>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-screen-2xl mx-auto px-6 py-6 text-sm text-gray-500 flex items-center justify-between">
          <div>© 2025 MediBear</div>
          <div>
            <a href="#" className="mr-4 hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PharmacyDashboard;
