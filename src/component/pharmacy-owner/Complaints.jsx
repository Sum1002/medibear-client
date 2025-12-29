import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PharmacyOwnerNav from './PharmacyOwnerNav';
import { getOrdersByPharmacy } from '../../service/http';
import toast, { Toaster } from 'react-hot-toast';

const Complaints = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [ordersWithComplaints, setOrdersWithComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrdersWithComplaints();
  }, []);

  const fetchOrdersWithComplaints = async () => {
    setLoading(true);
    try {
      const res = await getOrdersByPharmacy();
      const orders = Array.isArray(res.data.data) ? res.data.data : [];
      // Filter orders that have complaints
      const filtered = orders.filter(order => 
        order.complaints && order.complaints.length > 0
      );
      setOrdersWithComplaints(filtered);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = ordersWithComplaints.filter(order => 
    !searchTerm || 
    order.id.toString().includes(searchTerm) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <PharmacyOwnerNav showName/>
      <Toaster position="top-right" />

      <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-8 w-full">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-blue-900">Complaints</h1>
            <p className="text-sm text-gray-500 mt-1">Orders with customer complaints — review and resolve</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="search" 
              placeholder="Search order ID or customer name" 
              className="border rounded px-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <section>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading complaints...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No complaints found</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full" style={{ minWidth: '1100px' }}>
                <thead className="border-b">
                  <tr>
                    <th className="text-left px-4 py-3">Order ID</th>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Complaints Count</th>
                    <th className="text-left px-4 py-3">Latest Complaint</th>
                    <th className="text-left px-4 py-3">Order Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => {
                    const latestComplaint = order.complaints && order.complaints.length > 0 
                      ? order.complaints[order.complaints.length - 1] 
                      : null;
                    
                    return (
                      <tr key={order.id}>
                        <td className="px-4 py-3">#{order.id}</td>
                        <td className="px-4 py-3">{order.user?.name || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                            {order.complaints?.length || 0} complaint{order.complaints?.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {latestComplaint ? (
                            <div className="text-sm">
                              <p className="text-gray-900 line-clamp-2">{latestComplaint.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(latestComplaint.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'completed' ? 'bg-green-50 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                            order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => navigate(`/pharmacy/orders?orderId=${order.id}`)}
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                          >
                            View Order
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Complaints;
