import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [showCompleted, setShowCompleted] = useState(false);

  const [orders] = useState([
    {
      medicine: "Paracetamol 500mg",
      pharma: "Acme Pharma",
      by: "Customer A",
      scheduled: "2025-11-18 10:30",
      unit: 10,
      price: 0.12,
      status: "pending",
      pharmacyName: "City Pharmacy",
      pharmacyAddress: "12 Main St, Dhaka",
      recipientName: "Customer A",
      recipientAddress: "45 Lake Road, Dhaka",
      mapImage: "/medi-Image/map-static.png",
    },
    {
      medicine: "Amoxicillin 250mg",
      pharma: "HealthCorp",
      by: "Customer B",
      scheduled: "2025-11-18 11:00",
      unit: 2,
      price: 0.45,
      status: "completed",
      pharmacyName: "HealthPlus",
      pharmacyAddress: "78 Riverbank, Dhaka",
      recipientName: "Customer B",
      recipientAddress: "9 Commerce St, Dhaka",
      mapImage: "/medi-Image/map-static.png",
    },
    {
      medicine: "Cetirizine 10mg",
      pharma: "AllerGen",
      by: "Customer C",
      scheduled: "2025-11-19 09:45",
      unit: 5,
      price: 0.08,
      status: "pending",
      pharmacyName: "Neighborhood Pharmacy",
      pharmacyAddress: "7 Hill St, Dhaka",
      recipientName: "Customer C",
      recipientAddress: "3 Hilltop Ave, Dhaka",
      mapImage: "/medi-Image/map-static.png",
    },
    {
      medicine: "Metformin 500mg",
      pharma: "DiaLife",
      by: "Customer D",
      scheduled: "2025-11-20 14:00",
      unit: 1,
      price: 0.25,
      status: "pending",
      pharmacyName: "MediTrust",
      pharmacyAddress: "8 Market St, Dhaka",
      recipientName: "Customer D",
      recipientAddress: "12 Market St, Dhaka",
      mapImage: "/medi-Image/map-static.png",
    },
  ]);

  const filteredOrders = orders.filter(o => 
    showCompleted || o.status === 'pending'
  );

  const handleViewOrder = (order) => {
    const params = new URLSearchParams({
      medicine: order.medicine,
      pharma: order.pharma,
      by: order.by,
      scheduled: order.scheduled,
      unit: String(order.unit),
      price: String(order.price),
      status: order.status,
      pharmacyName: order.pharmacyName,
      pharmacyAddress: order.pharmacyAddress,
      recipientName: order.recipientName,
      recipientAddress: order.recipientAddress,
      mapImage: order.mapImage,
    });
    navigate(`/pharmacy/orders/details?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/medi-Image/MediBear-Main-Logo.png" alt="MediBear" className="h-10" />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pharmacy/dashboard" className="text-sm text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/login" className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm">
            Logout
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-8 w-full">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-blue-900">Order Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Pending orders — view details and update status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              <span className="text-sm text-gray-500">Show completed orders</span>
            </label>
          </div>
        </header>

        <section>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full" style={{ minWidth: '1100px' }}>
              <thead className="border-b">
                <tr>
                  <th className="text-left px-4 py-3">Medicine name</th>
                  <th className="text-left px-4 py-3">Order By</th>
                  <th className="text-left px-4 py-3">Schedule (date & time)</th>
                  <th className="text-left px-4 py-3">Order unit</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">{order.medicine}</td>
                    <td className="px-4 py-3">{order.by}</td>
                    <td className="px-4 py-3">{order.scheduled}</td>
                    <td className="px-4 py-3">{order.unit}</td>
                    <td className="px-4 py-3">
                      {order.status === 'pending' ? (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-50 text-yellow-700">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                      >
                        View order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderManagement;
