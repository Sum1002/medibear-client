import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "../../service/http";

const OrderManagment = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      setOrders(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const handleStatusChange = async (orderId, status) => {
    setProcessing(orderId);
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order ${status} successfully`);
      fetchOrders();
      if (drawerOpen && selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600";
      case "accepted":
        return "text-blue-600";
      case "in progress":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white font-sans">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Order Management</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Pharmacy</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order Date</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">#{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{order.user?.name || '—'}</div>
                        <div className="text-xs text-gray-500">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.pharmacy?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">৳ {parseFloat(order.total_price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Drawer */}
      {drawerOpen && selectedOrder && (
        <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
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
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Order ID
                </h3>
                <p className="text-lg font-bold">#{selectedOrder.id}</p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Status
                </h3>
                <span
                  className={`text-lg font-bold ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Customer & Pharmacy */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Customer
                </h3>
                <p className="font-semibold text-gray-900">
                  {selectedOrder.user?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.user?.phone}
                </p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Pharmacy
                </h3>
                <p className="font-semibold text-gray-900">
                  {selectedOrder.pharmacy?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.pharmacy?.email}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.pharmacy?.phone}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.address && (
              <div className="bg-gray-50 rounded p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Delivery Address
                </h3>
                <p className="text-gray-900">
                  {selectedOrder.address.address_line_1}
                </p>
                {selectedOrder.address.address_line_2 && (
                  <p className="text-gray-900">
                    {selectedOrder.address.address_line_2}
                  </p>
                )}
                <p className="text-gray-900">
                  {selectedOrder.address.city}, {selectedOrder.address.state}{" "}
                  {selectedOrder.address.zip_code}
                </p>
              </div>
            )}

            {/* Prescription */}
            {selectedOrder.prescription &&
              (() => {
                const prescriptionUrl = `http://localhost:8000/storage/${selectedOrder.prescription}`;
                const extension = selectedOrder.prescription
                  .split(".")
                  .pop()
                  .toLowerCase();
                const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
                  extension
                );

                return (
                  <div className="bg-gray-50 rounded p-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                      Prescription
                    </h3>
                    {isImage ? (
                      <div className="space-y-3">
                        <img
                          src={prescriptionUrl}
                          alt="Prescription"
                          className="w-full max-w-md rounded border"
                        />
                        <a
                          href={prescriptionUrl}
                          download
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Download Image
                        </a>
                      </div>
                    ) : (
                      <a
                        href={prescriptionUrl}
                        download
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Download Prescription
                      </a>
                    )}
                  </div>
                );
              })()}

            {/* Items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
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

            {/* Total */}
            <div className="bg-blue-50 rounded p-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">
                  ৳ {parseFloat(selectedOrder.total_price).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Payment: {selectedOrder.payment_type?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagment;
