import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import {
  getPendingPharmacies,
  approvePharmacy,
  rejectPharmacy,
} from "../../service/http";

const Verification = () => {
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingPharmacies();
  }, []);

  const fetchPendingPharmacies = async () => {
    setLoading(true);
    try {
      const response = await getPendingPharmacies();
      setPharmacies(
        Array.isArray(response.data.data) ? response.data.data : []
      );
    } catch (err) {
      console.error("Error fetching pharmacies:", err);
      toast.error("Failed to load pending pharmacies");
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pharmacyId) => {
    setProcessing(pharmacyId);
    try {
      await approvePharmacy(pharmacyId);
      toast.success("Pharmacy approved successfully");
      fetchPendingPharmacies();
    } catch (err) {
      console.error("Error approving pharmacy:", err);
      toast.error("Failed to approve pharmacy");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (pharmacyId) => {
    setProcessing(pharmacyId);
    try {
      await rejectPharmacy(pharmacyId);
      toast.success("Pharmacy rejected");
      fetchPendingPharmacies();
    } catch (err) {
      console.error("Error rejecting pharmacy:", err);
      toast.error("Failed to reject pharmacy");
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Submitted 1 day ago";
    return `Submitted ${diffDays} days ago`;
  };

  return (
    <div className="bg-linear-to-r from-blue-50 to-white font-sans min-h-screen flex flex-col">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto p-8 grow flex flex-col">
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-md">
            Pharmacy Verification
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-linear-to-r from-blue-950 to-blue-700 text-white font-semibold rounded-lg px-6 py-3 shadow-lg hover:shadow-xl transition duration-300"
          >
            Back to Dashboard
          </button>
        </header>

        <section className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col">
          <p className="mb-8 text-gray-700 text-lg tracking-wide">
            Review new pharmacy applications here. Approve reliable ones to help
            the community stay safe.
          </p>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : pharmacies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No pending pharmacy verifications.
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto max-h-[60vh]">
              {pharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="flex justify-between bg-blue-100 rounded-xl p-5 shadow-md hover:shadow-lg transition duration-300"
                >
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-900">
                      {pharmacy.name}
                    </h3>
                    <p className="mt-1 text-blue-700">
                      Location: {pharmacy.city || "N/A"}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Email: {pharmacy.email}
                    </p>
                    <p className="text-sm text-blue-600">
                      Phone: {pharmacy.phone}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      {formatDate(pharmacy.created_at)}
                    </p>
                    {pharmacy.google_map_link && (
                      <a
                        href={pharmacy.google_map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-700 underline mt-1 inline-block"
                      >
                        View on Map
                      </a>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleApprove(pharmacy.id)}
                      disabled={processing === pharmacy.id}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold shadow-md focus:outline-none transition disabled:opacity-50"
                    >
                      {processing === pharmacy.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(pharmacy.id)}
                      disabled={processing === pharmacy.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold shadow-md focus:outline-none transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Verification;
