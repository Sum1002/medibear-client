import React from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import PharmacyOwnerNav from './PharmacyOwnerNav';

const ComplaintDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const id = searchParams.get('id') || '—';
  const by = searchParams.get('by') || '—';
  const desc = searchParams.get('desc') || '—';
  const status = searchParams.get('status') || 'pending';
  const date = searchParams.get('date') || '—';

  const handleResolve = () => {
    alert('Complaint marked resolved (UI only).');
    navigate('/pharmacy/complaints');
  };

  const handlePending = () => {
    alert('Complaint marked pending (UI only).');
    navigate('/pharmacy/complaints');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <PharmacyOwnerNav
        extraLinks={[{ to: "/pharmacy/complaints", label: "Complaints" }]}
        showName
      />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold">Complaint Details</h2>
          <p className="text-gray-500 text-sm mt-1">Detailed view and actions</p>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-500">Complain ID</h3>
              <div className="mt-1 font-medium">{id}</div>

              <h3 className="text-sm text-gray-500 mt-4">Reported by</h3>
              <div className="mt-1">{by}</div>

              <h3 className="text-sm text-gray-500 mt-4">Reported on</h3>
              <div className="mt-1">{date}</div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Status</h3>
              <div className="mt-1">
                {status === 'pending' ? (
                  <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm">
                    Pending
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
                    Resolved
                  </span>
                )}
              </div>

              <h3 className="text-sm text-gray-500 mt-4">Actions</h3>
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={handleResolve}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Mark Resolved
                </button>
                <button 
                  onClick={handlePending}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Mark Pending
                </button>
              </div>
            </div>
          </div>

          <section className="mt-6">
            <h3 className="text-sm text-gray-500">Description</h3>
            <div className="mt-2">{desc}</div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetails;
