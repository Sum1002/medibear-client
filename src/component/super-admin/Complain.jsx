import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { getUserComplaints, respondToComplaint } from "../../service/http";

const Complain = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [responseStatus, setResponseStatus] = useState("resolved");
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const result = await getUserComplaints();
      setComplaints(Array.isArray(result.data.data) ? result.data.data : []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      toast.error("Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (complaintId) => {
    if (!adminResponse.trim()) {
      toast.error("Please enter an admin response");
      return;
    }

    setResponding(true);
    try {
      await respondToComplaint(complaintId, {
        status: responseStatus,
        admin_response: adminResponse,
      });
      toast.success("Complaint response submitted");
      setAdminResponse("");
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      console.error("Error responding to complaint:", err);
      toast.error("Failed to submit response");
    } finally {
      setResponding(false);
    }
  };

  // Escalation removed: admin should respond with a status and message.

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
    <div className="bg-linear-to-r from-blue-50 to-white font-sans min-h-screen flex flex-col">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto p-8 grow flex flex-col">
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-md">
            User Complaints
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-linear-to-r from-blue-950 to-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-6 py-3 shadow-lg transition duration-300"
          >
            Back to Dashboard
          </button>
        </header>

        <section className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col">
          <p className="mb-8 text-gray-700 text-lg tracking-wide">
            Analyze and take action on user complaints to improve service
            quality.
          </p>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No complaints found.
            </div>
          ) : (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-5 rounded-xl border-2 border-red-300 hover:border-red-400 shadow-md transition duration-300 bg-red-50"
                >
                  <h3 className="text-2xl font-semibold text-red-700">
                    Complaint #{complaint.id}
                  </h3>
                  <p className="text-red-600">
                    User: {complaint.user?.email || "N/A"}
                  </p>
                  <p className="text-red-600">
                    User Type:{" "}
                    {complaint.user?.register_as === "pharmacy"
                      ? "Pharmacy"
                      : "Customer"}
                  </p>
                  <p className="text-red-600">
                    Order ID: #{complaint.order_id}
                  </p>
                  {complaint.created_at && (
                    <p className="text-sm text-red-600">
                      Submitted: {formatDate(complaint.created_at)}
                    </p>
                  )}
                  <p className="mt-3 text-red-700 font-medium">
                    {complaint.message}
                  </p>

                  {complaint.admin_response && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Admin Response:
                      </p>
                      <p className="text-sm text-blue-800">
                        {complaint.admin_response}
                      </p>
                    </div>
                  )}

                  {selectedComplaint === complaint.id ? (
                    <div className="mt-5">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={responseStatus}
                            onChange={(e) => setResponseStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="resolved">Resolved</option>
                            <option value="in_progress">In Progress</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Response</label>
                          <textarea
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            placeholder="Write your response to the user..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleResolve(complaint.id)}
                            disabled={responding}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition disabled:opacity-50"
                          >
                            {responding ? "Sending..." : "Send Response"}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedComplaint(null);
                              setAdminResponse("");
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    !complaint.admin_response && (
                      <div className="mt-5 flex space-x-4">
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint.id);
                            setAdminResponse("");
                            setResponseStatus("resolved");
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition"
                        >
                          Respond
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Complain;
