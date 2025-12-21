import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const Complaints = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [complaints] = useState([
    { id: 'C-1001', by: 'Alice Rahman', desc: 'Incorrect medicine delivered (brand mismatch).', status: 'pending', date: '2025-11-12' },
    { id: 'C-1002', by: 'Rafi Khan', desc: 'Late delivery beyond promised slot.', status: 'resolved', date: '2025-11-10' },
    { id: 'C-1003', by: 'Nadia Karim', desc: 'Damaged packaging and spillage.', status: 'pending', date: '2025-11-14' },
    { id: 'C-1004', by: 'Munir Hossain', desc: 'Missing item from order.', status: 'resolved', date: '2025-11-09' }
  ]);

  const filteredComplaints = complaints.filter(c => 
    !searchTerm || 
    (c.id + c.by).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (complaint) => {
    const params = new URLSearchParams({
      id: complaint.id,
      by: complaint.by,
      desc: complaint.desc,
      status: complaint.status,
      date: complaint.date
    });
    navigate(`/pharmacy/complaints/${complaint.id}?${params.toString()}`);
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
            <h1 className="text-2xl font-semibold text-blue-900">Complaints</h1>
            <p className="text-sm text-gray-500 mt-1">Customer complaints — review and resolve</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="search" 
              placeholder="Search complain id or name" 
              className="border rounded px-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <section>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full" style={{ minWidth: '1100px' }}>
              <thead className="border-b">
                <tr>
                  <th className="text-left px-4 py-3">Complain ID</th>
                  <th className="text-left px-4 py-3">Complained by</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="px-4 py-3">{complaint.id}</td>
                    <td className="px-4 py-3">{complaint.by}</td>
                    <td className="px-4 py-3">{complaint.desc}</td>
                    <td className="px-4 py-3">
                      {complaint.status === 'pending' ? (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-50 text-yellow-700">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700">
                          Resolved
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleViewDetails(complaint)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
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
      </main>
    </div>
  );
};

export default Complaints;
