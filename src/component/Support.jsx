import React, { useState, useEffect } from "react";
import { postUserComplaint, getMyComplaints } from "../service/http";
import toast, { Toaster } from "react-hot-toast";

export default function Support() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter your message");
      return;
    }
    setSubmitting(true);
    try {
      const resp = await postUserComplaint({ message });
      if (resp.data?.success) {
        toast.success("Complaint submitted successfully");
        setMessage("");
        fetchMyComplaints();
      } else {
        toast.error(resp.data?.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error("Submit complaint error:", err);
      const errMsg =
        err.response?.data?.message || "Failed to submit complaint";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMyComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const resp = await getMyComplaints();
      setComplaints(Array.isArray(resp.data.data) ? resp.data.data : []);
    } catch (err) {
      console.error("Error fetching my complaints:", err);
      toast.error("Failed to fetch your complaints");
      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-50 to-white py-12">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          <div className="md:col-span-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-blue-900">Support</h2>
            <p className="text-gray-600">
              We're here to help. Reach out to us for any account, order or
              product related issues.
            </p>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">Contact</h4>
              <p className="text-gray-600 mt-1">Email: support@medibear.com</p>
              <p className="text-gray-600">Phone: +880 1234 567890</p>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Office Hours
              </h4>
              <p className="text-gray-600 mt-1">Mon – Fri: 9:00 AM – 6:00 PM</p>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Quick Links
              </h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>
                  <a href="/" className="text-blue-600 hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/pharmacies"
                    className="text-blue-600 hover:underline"
                  >
                    Find Pharmacies
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-blue-600 hover:underline">
                    Products
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 p-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                <details className="bg-white border rounded p-3">
                  <summary className="font-medium">
                    How long does delivery take?
                  </summary>
                  <p className="text-gray-600 mt-2">
                    Delivery time depends on your location and pharmacy but
                    usually within 24-48 hours.
                  </p>
                </details>

                <details className="bg-white border rounded p-3">
                  <summary className="font-medium">
                    Can I return medicines?
                  </summary>
                  <p className="text-gray-600 mt-2">
                    Returns are accepted for unopened items within 7 days.
                    Contact support for details.
                  </p>
                </details>

                <details className="bg-white border rounded p-3">
                  <summary className="font-medium">
                    How to upload a prescription?
                  </summary>
                  <p className="text-gray-600 mt-2">
                    During checkout, use the prescription upload field to attach
                    an image or PDF of your prescription.
                  </p>
                </details>
              </div>

              <hr className="my-6" />

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Send a message to admin
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Describe your issue and our support team will get back to you.
              </p>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Write your message here..."
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>

                <button
                  onClick={() => setMessage("")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Clear
                </button>
              </div>
              <hr className="my-6" />

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Your Submitted Complaints
              </h3>
              {loadingComplaints ? (
                <p className="text-gray-600">Loading...</p>
              ) : complaints.length === 0 ? (
                <p className="text-gray-600">
                  You have not submitted any complaints yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {complaints.map((c) => (
                    <div key={c.id} className="bg-white border rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-800 font-semibold">
                            Complaint #{c.id} - {c.status || "pending"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(c.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{c.message}</p>
                      {c.admin_response && (
                        <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
                          <p className="text-sm font-semibold text-blue-900">
                            Admin Response
                          </p>
                          <p className="text-sm text-blue-800">
                            {c.admin_response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
