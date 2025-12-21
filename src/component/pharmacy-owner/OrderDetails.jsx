import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import PharmacyOwnerNav from './PharmacyOwnerNav';

const OrderDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const medicine = searchParams.get('medicine') || '';
  const pharma = searchParams.get('pharma') || '';
  const by = searchParams.get('by') || '';
  const scheduled = searchParams.get('scheduled') || '';
  const unit = Number(searchParams.get('unit') || 0);
  const price = Number(searchParams.get('price') || 0);
  const status = searchParams.get('status') || '';
  const pharmacyName = searchParams.get('pharmacyName') || '';
  const pharmacyAddress = searchParams.get('pharmacyAddress') || '';
  const recipientName = searchParams.get('recipientName') || '';
  const recipientAddress = searchParams.get('recipientAddress') || '';
  const mapImage = searchParams.get('mapImage') || '/medi-Image/map-static.png';

  const handleConfirm = () => {
    alert('Order confirmed — this would update the order status in a real app.');
    navigate('/pharmacy/orders');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      alert('Order cancelled.');
      navigate('/pharmacy/orders');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <PharmacyOwnerNav
        extraLinks={[{ to: "/pharmacy/orders", label: "Orders" }]}
        showName
      />

      <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-8 w-full">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-blue-900">Order details</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review the order and confirm or cancel.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Order summary */}
          <section className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-lg font-medium">Order</h2>
            <div className="mt-4 text-sm text-gray-500">
              <div><strong>Order by:</strong> {by}</div>
              <div className="mt-1"><strong>Scheduled:</strong> {scheduled}</div>
              <div className="mt-1"><strong>Status:</strong> {status}</div>
            </div>
            <h3 className="mt-4 font-medium">Items</h3>
            <table className="w-full mt-2 text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th>Medicine</th>
                  <th>Pharma</th>
                  <th>Unit</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y mt-2">
                <tr>
                  <td className="py-3">{medicine}</td>
                  <td className="py-3">{pharma}</td>
                  <td className="py-3">{unit}</td>
                  <td className="py-3 text-right">৳ {(unit * price).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">Total</div>
              <div className="font-semibold text-lg text-blue-900">
                ৳ {(unit * price).toFixed(2)}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm order
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100"
              >
                Cancel order
              </button>
              <Link
                to="/pharmacy/orders"
                className="ml-auto text-sm text-gray-500 underline self-center"
              >
                Back to orders
              </Link>
            </div>
          </section>

          {/* Right: Pharmacy & Recipient + Map */}
          <aside className="lg:col-span-2 grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-medium">Pharmacy</h3>
              <div className="mt-2 text-sm text-gray-500">
                <div><strong>{pharmacyName}</strong></div>
                <div className="mt-1">{pharmacyAddress}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-medium">Recipient</h3>
              <div className="mt-2 text-sm text-gray-500">
                <div><strong>{recipientName}</strong></div>
                <div className="mt-1">{recipientAddress}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-medium">Delivery location</h3>
              <div className="mt-3">
                <img
                  src={mapImage}
                  alt="Map"
                  className="w-full rounded"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
