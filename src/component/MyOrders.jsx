import { useEffect, useState } from "react";
import { getOrdersByUser, getOrderComplaints, createOrderComplaint } from "../service/http";
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast, { Toaster } from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsError, setComplaintsError] = useState(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrdersByUser();
      setOrders(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
    fetchComplaints(order.id);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
    setComplaints([]);
    setShowComplaintForm(false);
    setComplaintText("");
  };

  const fetchComplaints = async (orderId) => {
    setComplaintsLoading(true);
    setComplaintsError(null);
    try {
      const res = await getOrderComplaints(orderId);
      const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setComplaints(list);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setComplaintsError("Failed to load complaints");
      setComplaints([]);
    } finally {
      setComplaintsLoading(false);
    }
  };

  const submitComplaint = async () => {
    if (!selectedOrder?.id) return;
    const message = complaintText.trim();
    if (!message) {
      toast.error("Please write your complaint message");
      return;
    }
    setComplaintSubmitting(true);
    try {
      const res = await createOrderComplaint(selectedOrder.id, message);
      const created = res.data?.data || res.data || { message, id: Date.now(), created_at: new Date().toISOString() };
      setComplaints((prev) => [created, ...prev]);
      setComplaintText("");
      setShowComplaintForm(false);
      toast.success("Complaint submitted");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      const msg = err.response?.data?.message || "Failed to submit complaint";
      toast.error(msg);
    } finally {
      setComplaintSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-amber-100 text-amber-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-5xl mx-auto px-6 py-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-blue-900">My Orders</h1>
            <p className="text-gray-600 mt-1">View and manage your orders</p>
          </header>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You have no orders yet.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Pharmacy
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Total Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Payment Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.pharmacy?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ৳ {parseFloat(order.total_price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.payment_type?.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleOrderClick(order)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Side Drawer */}
      {drawerOpen && selectedOrder && (
        <div className="fixed right-0 top-0 bottom-0 w-3xl bg-white shadow-lg z-50 overflow-y-auto transition-transform transform translate-x-0">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={closeDrawer}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Header */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Order ID
              </h3>
              <p className="text-lg font-bold text-gray-900">
                #{selectedOrder.id}
              </p>
            </div>

            {/* Order Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Status
              </h3>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            {/* Pharmacy Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Pharmacy
              </h3>
              <div className="bg-gray-50 rounded p-4">
                <p className="font-semibold text-gray-900">
                  {selectedOrder.pharmacy?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedOrder.pharmacy?.phone}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Payment Method
                </h3>
                <p className="text-gray-900 font-medium">
                  {selectedOrder.payment_type?.toUpperCase()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Order Date
                </h3>
                <p className="text-gray-900 font-medium">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.address && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Delivery Address
                </h3>
                <div className="bg-gray-50 rounded p-4">
                  <p className="text-gray-900">{selectedOrder.address.address_line_1}</p>
                  {selectedOrder.address.address_line_2 && (
                    <p className="text-gray-900">{selectedOrder.address.address_line_2}</p>
                  )}
                  <p className="text-gray-900 mt-1">
                    {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zip_code}
                  </p>
                  {selectedOrder.address.country && (
                    <p className="text-gray-900">{selectedOrder.address.country}</p>
                  )}
                </div>
              </div>
            )}

            {/* Prescription */}
            {selectedOrder.prescription && (() => {
              const prescriptionUrl = `http://localhost:8000/storage/${selectedOrder.prescription}`;
              const extension = selectedOrder.prescription.split('.').pop().toLowerCase();
              const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
              const isPdf = extension === 'pdf';
              
              return (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">
                    Prescription
                  </h3>
                  <div className="bg-gray-50 rounded p-4">
                    {isImage ? (
                      <div className="space-y-3">
                        <img
                          src={prescriptionUrl}
                          alt="Prescription"
                          className="w-full max-w-md rounded border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'block';
                          }}
                        />
                        <a
                          href={prescriptionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                          style={{ display: 'none' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Prescription
                        </a>
                        <a
                          href={prescriptionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Image
                        </a>
                      </div>
                    ) : isPdf ? (
                      <a
                        href={prescriptionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF Prescription
                      </a>
                    ) : (
                      <a
                        href={prescriptionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Prescription
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-gray-50 rounded p-3 flex gap-3"
                  >
                    <img
                      src={
                        item.product?.image_path
                          ? `http://localhost:8000/storage/${item.product.image_path}`
                          : "/medi-Image/MediBear-Main-Logo.png"
                      }
                      alt={item.product?.name}
                      className="w-12 h-12 object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "/medi-Image/MediBear-Main-Logo.png";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.product?.name}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          ৳ {parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ৳ {(parseFloat(selectedOrder.total_price)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-gray-900">৳ 50.00</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">
                  ৳ {(parseFloat(selectedOrder.total_price) + 50).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Complaints */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600">Complaints</h3>
                <button
                  onClick={() => setShowComplaintForm((v) => !v)}
                  className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  {showComplaintForm ? "Close" : "Complain"}
                </button>
              </div>

              {showComplaintForm && (
                <div className="bg-gray-50 rounded p-4 space-y-3">
                  <label className="text-sm font-medium text-gray-700">Your complaint</label>
                  <textarea
                    className="w-full rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={3}
                    placeholder="Type your complaint..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowComplaintForm(false)}
                      className="px-3 py-1.5 rounded border text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitComplaint}
                      disabled={complaintSubmitting}
                      className={`px-3 py-1.5 rounded text-sm text-white ${complaintSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      {complaintSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              )}

              <div>
                {complaintsLoading ? (
                  <p className="text-sm text-gray-500">Loading complaints...</p>
                ) : complaintsError ? (
                  <p className="text-sm text-red-600">{complaintsError}</p>
                ) : complaints.length === 0 ? (
                  <p className="text-sm text-gray-500">No complaints yet.</p>
                ) : (
                  <div className="space-y-3">
                    {complaints.map((c, idx) => (
                      <div key={c.id || idx} className="bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-900">{c.message}</p>
                        {c.created_at && (
                          <p className="text-xs text-gray-500 mt-1">{formatDate(c.created_at)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
