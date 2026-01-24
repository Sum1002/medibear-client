import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { getAllOrders } from "../../service/http";

const PERIODS = {
  weekly: { label: "Weekly (last 7 days)", days: 7 },
  monthly: { label: "Monthly (last 30 days)", days: 30 },
  yearly: { label: "Yearly (last 365 days)", days: 365 },
};

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return `Tk ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Report = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePeriod, setActivePeriod] = useState("weekly");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      const list = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      setOrders(list);
    } catch (err) {
      console.error("Failed to load orders for report", err);
      toast.error("Unable to load payment data");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];
    const days = PERIODS[activePeriod]?.days || 7;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    return orders.filter((order) => {
      const createdAt = order.created_at || order.createdAt;
      if (!createdAt) return false;
      const date = new Date(createdAt);
      return date >= start;
    });
  }, [orders, activePeriod]);

  const metrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + (Number(order.total_price) || 0),
      0,
    );

    const paymentMix = filteredOrders.reduce((acc, order) => {
      const key = (order.payment_type || "unknown").toUpperCase();
      const current = acc[key] || { amount: 0, count: 0 };
      current.amount += Number(order.total_price) || 0;
      current.count += 1;
      acc[key] = current;
      return acc;
    }, {});

    const topPaymentType = Object.entries(paymentMix).sort(
      (a, b) => b[1].amount - a[1].amount,
    )[0]?.[0];

    return {
      totalRevenue,
      orderCount: filteredOrders.length,
      topPaymentType: topPaymentType || "Not enough data",
      paymentMix,
    };
  }, [filteredOrders]);

  const handleDownload = () => {
    if (!filteredOrders.length) return;
    setDownloading(true);

    try {
      const header = [
        "Order ID",
        "Customer",
        "Pharmacy",
        "Payment Type",
        "Amount",
        "Status",
        "Created At",
      ];

      const rows = filteredOrders.map((order) => [
        order.id,
        order.user?.name || "",
        order.pharmacy?.name || "",
        (order.payment_type || "").toUpperCase(),
        Number(order.total_price) || 0,
        order.status || "",
        order.created_at || order.createdAt || "",
      ]);

      // Append period-level summary at the bottom for quick reference
      rows.push([]);
      rows.push([`Summary (${PERIODS[activePeriod].label})`]);
      rows.push(["Total Orders", filteredOrders.length]);
      rows.push(["Total Revenue", metrics.totalRevenue]);

      const csv = [header, ...rows]
        .map((row) =>
          row
            .map((cell) => {
              const safe = cell === undefined || cell === null ? "" : cell;
              const str = safe.toString().replace(/"/g, '""');
              return `"${str}"`;
            })
            .join(","),
        )
        .join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payments-${activePeriod}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download report", err);
      toast.error("Could not generate CSV");
    } finally {
      setDownloading(false);
    }
  };

  const timeframeLabel = useMemo(() => {
    const days = PERIODS[activePeriod]?.days || 7;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }, [activePeriod]);

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-50 to-white">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Payment Reports</h1>
            <p className="text-gray-600">
              Track total order payments by week, month, and year.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={!filteredOrders.length || downloading}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? "Preparing..." : "Download CSV"}
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(PERIODS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActivePeriod(key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  activePeriod === key
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                }`}
              >
                {value.label}
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-auto">
              Range: {timeframeLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs uppercase text-gray-500">Total revenue</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {formatCurrency(metrics.totalRevenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {activePeriod === "weekly" ? "Last 7 days" : PERIODS[activePeriod].label}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs uppercase text-gray-500">Orders</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {metrics.orderCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">Processed in range</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs uppercase text-gray-500">Top payment</p>
            <p className="text-lg font-semibold text-blue-900 mt-1">
              {metrics.topPaymentType}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(metrics.paymentMix).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full"
                >
                  <span className="font-semibold">{key}</span>
                  <span className="text-gray-600">{value.count}x</span>
                </span>
              ))}
              {!Object.keys(metrics.paymentMix).length && (
                <span className="text-xs text-gray-500">No payments in range</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Orders in range</h3>
              <p className="text-sm text-gray-500">
                Showing payments within the selected period only.
              </p>
            </div>
            <span className="text-sm text-gray-500">
              {filteredOrders.length} results
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Pharmacy</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Payment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      Loading payments...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No orders in this range.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="font-medium">{order.user?.name || ""}</div>
                        <div className="text-xs text-gray-500">{order.user?.email || ""}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.pharmacy?.name || ""}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{(order.payment_type || "").toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(order.total_price)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;