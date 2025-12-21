import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const Summary = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-11');
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    totalUnits: 0,
    aov: 0,
    ordersCount: 0,
    topProduct: '—',
    revChange: '+0%',
    items: []
  });

  const sampleData = {
    '2025-11': {
      orders: 124,
      items: [
        { name: 'PharmaA', units: 320, price: 45.0 },
        { name: 'PharmaB', units: 210, price: 32.5 },
        { name: 'PharmaC', units: 180, price: 50.0 },
        { name: 'PharmaD', units: 95, price: 120.0 },
        { name: 'PharmaE', units: 60, price: 18.0 }
      ]
    },
    '2025-10': {
      orders: 98,
      items: [
        { name: 'PharmaA', units: 220, price: 45.0 },
        { name: 'PharmaB', units: 240, price: 32.5 },
        { name: 'PharmaC', units: 150, price: 50.0 },
        { name: 'PharmaD', units: 120, price: 120.0 },
        { name: 'PharmaE', units: 40, price: 18.0 }
      ]
    },
    '2025-09': {
      orders: 110,
      items: [
        { name: 'PharmaA', units: 280, price: 45.0 },
        { name: 'PharmaB', units: 190, price: 32.5 },
        { name: 'PharmaC', units: 210, price: 50.0 },
        { name: 'PharmaD', units: 50, price: 120.0 },
        { name: 'PharmaE', units: 75, price: 18.0 }
      ]
    }
  };

  useEffect(() => {
    const data = sampleData[selectedMonth] || { orders: 0, items: [] };
    const items = data.items.slice().sort((a, b) => (b.units * b.price) - (a.units * a.price));
    const totalRevenue = items.reduce((s, it) => s + it.units * it.price, 0);
    const totalUnits = items.reduce((s, it) => s + it.units, 0);
    const orders = data.orders || 0;

    const months = Object.keys(sampleData).sort();
    const idx = months.indexOf(selectedMonth);
    let revChange = '—';
    if (idx > 0) {
      const prev = months[idx - 1];
      const prevRev = sampleData[prev].items.reduce((s, it) => s + it.units * it.price, 0);
      const change = prevRev ? ((totalRevenue - prevRev) / prevRev) * 100 : 0;
      revChange = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
    }

    setSummaryData({
      totalRevenue,
      totalUnits,
      aov: orders ? totalRevenue / orders : 0,
      ordersCount: orders,
      topProduct: items.length ? items[0].name : '—',
      revChange,
      items
    });
  }, [selectedMonth]);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
            <h1 className="text-2xl font-semibold text-blue-900">Monthly Summary</h1>
            <p className="text-sm text-gray-500 mt-1">Revenue and sales breakdown by pharmaceutical</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="month" className="text-sm text-gray-500">Month</label>
            <select
              id="month"
              className="border rounded px-3 py-2 text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="2025-11">Nov 2025</option>
              <option value="2025-10">Oct 2025</option>
              <option value="2025-09">Sep 2025</option>
            </select>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              ৳ {numberWithCommas(summaryData.totalRevenue.toFixed(2))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Compared to last month: <span style={{ color: summaryData.revChange.startsWith('+') ? '#059669' : '#b91c1c' }}>{summaryData.revChange}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
            <div className="text-sm text-gray-500">Total Units Sold</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{summaryData.totalUnits}</div>
            <div className="text-sm text-gray-500 mt-1">
              Top product: <span>{summaryData.topProduct}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
            <div className="text-sm text-gray-500">Average Order Value</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              ৳ {numberWithCommas(summaryData.aov.toFixed(2))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Orders processed: <span>{summaryData.ordersCount}</span>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow overflow-x-auto">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Sales by Pharmaceutical</h2>
            <table className="min-w-full" style={{ minWidth: '1100px' }}>
              <thead className="border-b">
                <tr>
                  <th className="text-left px-4 py-3">Pharmaceutical</th>
                  <th className="text-left px-4 py-3">Units Sold</th>
                  <th className="text-left px-4 py-3">Revenue</th>
                  <th className="text-left px-4 py-3">% of Total</th>
                  <th className="text-left px-4 py-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {summaryData.items.map((item, idx) => {
                  const revenue = item.units * item.price;
                  const pct = summaryData.totalRevenue ? Math.round((revenue / summaryData.totalRevenue) * 100) : 0;
                  return (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">{item.units}</td>
                      <td className="px-4 py-3">৳ {numberWithCommas(revenue.toFixed(2))}</td>
                      <td className="px-4 py-3">{pct}%</td>
                      <td className="px-4 py-3 w-64">
                        <div className="h-3 bg-blue-100 rounded-full">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-sm text-gray-500">Notes</h3>
            <p className="text-sm text-gray-500 mt-2">
              Data shown is sample/demo data rendered client-side. Replace with your server data for production.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Summary;
