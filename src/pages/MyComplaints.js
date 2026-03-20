import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../utils/api';

const MyComplaints = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    complaintAPI.getMyComplaints().then(res => setComplaints(res.data)).finally(() => setLoading(false));
  }, [user, navigate]);

  const statusColor = (s) => ({
    'Pending': 'status-pending', 'In Progress': 'status-progress',
    'Resolved': 'status-resolved', 'Cancelled': 'status-cancelled'
  }[s] || 'status-pending');

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="hero-gradient py-10 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black mb-1">My Complaints</h1>
          <p className="text-blue-200">Track all your service requests</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-5">
          <p className="text-slate-600 font-medium">{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} found</p>
          <Link to="/complaint" className="btn-primary text-sm">+ New Complaint</Link>
        </div>
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="text-5xl mb-4">🔧</div>
            <h3 className="font-bold text-slate-700 mb-2">No Complaints Yet</h3>
            <p className="text-slate-500 mb-5">Having issues with your purifier? Register a complaint and we'll fix it fast.</p>
            <Link to="/complaint" className="btn-primary">Register Complaint</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono font-bold text-blue-700">{c.complaintId}</p>
                    <p className="font-semibold text-slate-800">{c.issueType}</p>
                  </div>
                  <span className={`badge text-xs ${statusColor(c.status)}`}>{c.status}</span>
                </div>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{c.issueDescription}</p>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Registered: {new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                  {c.assignedTechnicianName && <span>👷 {c.assignedTechnicianName}</span>}
                </div>
                <Link to={`/track-complaint?id=${c.complaintId}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  Track Status →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
