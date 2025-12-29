import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import PharmacyOwnerNav from "./PharmacyOwnerNav";
import Summary from "./Summary";
import { getOrdersByPharmacy } from "../../service/http";

const PharmacyDashboard = () => {
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [ordersWithComplaints, setOrdersWithComplaints] = useState([]);

  useEffect(() => {
    fetchComplaintsCount();
  }, []);

  const fetchComplaintsCount = async () => {
    try {
      const res = await getOrdersByPharmacy();
      const orders = Array.isArray(res.data.data) ? res.data.data : [];
      // Filter orders that have complaints
      const ordersWithComplaints = orders.filter(order => 
        order.complaints && order.complaints.length > 0
      );
      setOrdersWithComplaints(ordersWithComplaints);
      // Count total complaints
      const totalComplaints = ordersWithComplaints.reduce((sum, order) => 
        sum + (order.complaints?.length || 0), 0
      );
      setComplaintsCount(totalComplaints);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div>
                      <div className="text-2xl font-bold text-blue-600 mt-2">
                        Orders
                      </div>
                  </div>
                </div>
              </div>
            </Link>
          </article>

          {/* Complaints Card */}
          <article className="bg-white rounded-xl p-5 shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg">
            <Link
              to="/pharmacy/complaints"
              className="block h-full"
              aria-label="View Complaints"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-linear-to-br from-red-50 to-pink-50 text-red-600">
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
                      d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">
                      Complaints
                    </div>
                    {complaintsCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {complaintsCount} New
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          {ordersWithComplaints.length} order{ordersWithComplaints.length !== 1 ? 's' : ''} with complaints
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </article>

          {/* Embedded Summary Details */}
          <div className="lg:col-span-4">
            <Summary embedded />
          </div>
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
