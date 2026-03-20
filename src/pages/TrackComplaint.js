import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { complaintAPI } from '../utils/api';

const STATUS_STEPS = ['Pending', 'In Progress', 'Resolved'];

const TrackComplaint = () => {
  const [searchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('id')) {
      handleTrack(searchParams.get('id'));
    }
  }, []);

  const handleTrack = async (id = complaintId) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    setComplaint(null);
    try {
      const res = await complaintAPI.track(id.trim().toUpperCase());
      setComplaint(res.data);
    } catch (err) {
      setError('Complaint not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const map = {
      'Pending': 'status-pending',
      'In Progress': 'status-progress',
      'Resolved': 'status-resolved',
      'Closed': 'status-resolved',
      'Cancelled': 'status-cancelled'
    };
    return map[status] || 'status-pending';
  };

  const currentStep = STATUS_STEPS.indexOf(complaint?.status);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="hero-gradient py-12 px-4 text-white text-center">
        <h1 className="text-4xl font-black mb-3">Track Your Complaint</h1>
        <p className="text-blue-100">Enter your complaint ID to get real-time status updates</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10">
        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex gap-3">
            <input
              className="form-input flex-1"
              placeholder="Enter Complaint ID (e.g. CMP240101XXXX)"
              value={complaintId}
              onChange={e => setComplaintId(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
            />
            <button onClick={() => handleTrack()} disabled={loading}
              className="btn-primary whitespace-nowrap disabled:opacity-70">
              {loading ? '⏳' : '🔍 Track'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center text-red-600 mb-6">
            <div className="text-3xl mb-2">😕</div>
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {complaint && (
          <div className="space-y-4 animate-fade-in">
            {/* Complaint header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Complaint ID</p>
                  <p className="text-xl font-black text-blue-700">{complaint.complaintId}</p>
                </div>
                <span className={`badge text-sm ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  {STATUS_STEPS.map((step, i) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                          currentStep >= i ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white text-slate-400'
                        }`}>
                          {currentStep > i ? '✓' : i + 1}
                        </div>
                        <span className={`text-xs ${currentStep >= i ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 -mt-4 ${currentStep > i ? 'bg-blue-500' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Customer Name</p>
                  <p className="font-semibold text-slate-800">{complaint.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Registered On</p>
                  <p className="font-semibold text-slate-800">
                    {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                {complaint.productBrand && (
                  <div>
                    <p className="text-slate-500 text-xs">Product</p>
                    <p className="font-semibold text-slate-800">{complaint.productBrand} {complaint.productModel}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-500 text-xs">Issue Type</p>
                  <p className="font-semibold text-slate-800">{complaint.issueType}</p>
                </div>
                {complaint.assignedTechnicianName && (
                  <div>
                    <p className="text-slate-500 text-xs">Assigned Technician</p>
                    <p className="font-semibold text-slate-800">👷 {complaint.assignedTechnicianName}</p>
                  </div>
                )}
                {complaint.scheduledDate && (
                  <div>
                    <p className="text-slate-500 text-xs">Scheduled Date</p>
                    <p className="font-semibold text-slate-800">
                      📅 {new Date(complaint.scheduledDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status history */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Status Timeline</h3>
              <div className="space-y-4">
                {complaint.statusHistory?.map((entry, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full mt-1.5"
                        style={{ background: i === complaint.statusHistory.length - 1 ? '#0277e0' : '#cbd5e1' }} />
                      {i < complaint.statusHistory.length - 1 && <div className="w-0.5 bg-slate-200 flex-1 mt-1 min-h-6" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex justify-between items-start">
                        <span className={`badge text-xs ${getStatusColor(entry.status)}`}>{entry.status}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(entry.timestamp).toLocaleDateString('en-IN')} {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {entry.note && <p className="text-sm text-slate-600 mt-1">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;
