import React, { useEffect, useState } from 'react';
import PharmacyOwnerNav from './PharmacyOwnerNav';
import { getPharmacySummary } from '../../service/http';

const Summary = ({ embedded = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    order_count: 0,
    total_order_value: 0,
    total_completed_order: 0,
    total_pending_order: 0,
    total_items: 0,
    top_supplier: null,
    top_customer: null,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPharmacySummary();
        const data = res.data?.data || res.data || {};
        setSummary({
          order_count: data.order_count || 0,
          total_order_value: data.total_order_value || 0,
          total_completed_order: data.total_completed_order || 0,
          total_pending_order: data.total_pending_order || 0,
          total_items: data.total_items || 0,
          top_supplier: data.top_supplier || null,
          top_customer: data.top_customer || null,
        });
      } catch (err) {
        console.error('Error fetching summary:', err);
        setError('Failed to load summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const numberWithCommas = (x) => {
    const n = Number(x || 0);
    return n.toLocaleString('en-US');
  };

  const Content = (
    <>
      <header className="mb-6">
        <p className="text-sm text-gray-500 mt-1">Key metrics and highlights for your pharmacy</p>
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading summary...</div>
      ) : (
        <>
          {/* Metrics Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 7l1.5 12.5A2 2 0 006.5 21h11a2 2 0 001.99-1.5L21 7"/></svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Orders</div>
                  <div className="text-2xl font-bold text-blue-600">{numberWithCommas(summary.order_count)}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12M19 10v8M5 14v4"/></svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total Order Value</div>
                  <div className="text-2xl font-bold text-blue-600">৳ {numberWithCommas(Number(summary.total_order_value).toFixed(2))}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h10M4 18h6"/></svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Items Sold</div>
                  <div className="text-2xl font-bold text-blue-600">{numberWithCommas(summary.total_items)}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-green-50 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Completed</div>
                  <div className="text-2xl font-bold text-blue-600">{numberWithCommas(summary.total_completed_order)}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M4 12h16"/></svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Pending</div>
                  <div className="text-2xl font-bold text-blue-600">{numberWithCommas(summary.total_pending_order)}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-900">Top Supplier</h2>
                <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">Supplier</span>
              </div>
              {summary.top_supplier ? (
                <div className="mt-4">
                  <p className="text-xl font-bold text-gray-900">{summary.top_supplier.supplier_name}</p>
                  <p className="text-sm text-gray-500 mt-1">Orders: {numberWithCommas(summary.top_supplier.orders_count)}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">No supplier data</p>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-900">Top Customer</h2>
                <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">Customer</span>
              </div>
              {summary.top_customer ? (
                <div className="mt-4">
                  <p className="text-xl font-bold text-gray-900">{summary.top_customer.user_name}</p>
                  <p className="text-sm text-gray-500 mt-1">Orders: {numberWithCommas(summary.top_customer.orders_count)}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">No customer data</p>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );

  if (embedded) {
    return (
      <div className="w-full">
        {Content}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <PharmacyOwnerNav showName />
      <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-8 w-full">{Content}</main>
    </div>
  );
};

export default Summary;
