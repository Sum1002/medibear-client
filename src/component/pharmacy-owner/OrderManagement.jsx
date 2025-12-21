import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import PharmacyOwnerNav from './PharmacyOwnerNav';
import { getOrdersByPharmacy } from '../../service/http';
import toast, { Toaster } from 'react-hot-toast';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrdersByPharmacy();
      setOrders(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) =>
    showCompleted ? true : o.status === 'pending' || o.status === 'confirmed',
  );

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <PharmacyOwnerNav showName />
      <Toaster position="top-right" />

      <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-8 w-full">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-blue-900">
              Order Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              <span className="text-sm text-gray-500">Show all orders</span>
            </label>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No orders found.
          </div>
        ) : (
          <section>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead className="border-b bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold">
                      Order ID
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold">
                      Items
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold">
                      Total Price
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold">
                      Payment Type
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.user?.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        ৳ {parseFloat(order.total_price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.payment_type?.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleViewOrder(order)}
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
          </section>
        )}
      </main>

      {/* Side Drawer */}
      {drawerOpen && selectedOrder && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-lg z-50 overflow-y-auto transition-transform transform translate-x-0">
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
                  selectedOrder.status,
                )}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Customer
              </h3>
              <div className="bg-gray-50 rounded p-4">
                <p className="font-semibold text-gray-900">
                  {selectedOrder.user?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedOrder.user?.phone}
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

            {/* Items */}
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
                          : '/medi-Image/MediBear-Main-Logo.png'
                      }
                      alt={item.product?.name}
                      className="w-12 h-12 object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          '/medi-Image/MediBear-Main-Logo.png';
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
                  ৳{' '}
                  {(parseFloat(selectedOrder.total_price)).toFixed(2)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
