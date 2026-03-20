import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../utils/api';
import { toast } from 'react-toastify';

const ISSUE_TYPES = [
  'No Water Output', 'Low Water Output', 'Water Leakage', 'Dirty/Smelly Water',
  'Unusual Noise', 'Indicator Light Issue', 'TDS Level High', 'Motor Not Working',
  'Filter Replacement', 'General Service/AMC', 'Other'
];
const BRANDS = ['BlueDrop', 'Kent', 'Aquaguard', 'Livpure', 'Other'];

const Complaint = () => {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', pincode: '',
    productBrand: '', productModel: '', issueType: '', issueDescription: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await complaintAPI.register(form);
      setResult(res.data);
      toast.success('Complaint registered successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error registering complaint');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center animate-bounce-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #0277e0, #014687)' }}>
          🎫
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Complaint Registered!</h2>
        <p className="text-slate-500 mb-6">Your complaint has been registered. Our technician will contact you within 24 hours.</p>
        <div className="bg-blue-50 rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs text-slate-500 mb-1">Your Complaint ID</p>
          <p className="text-2xl font-black text-blue-700 mb-3">{result.complaintId}</p>
          <p className="text-xs text-slate-500 mb-1">Status</p>
          <span className="badge status-pending">{result.status}</span>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Save your complaint ID to track your service request. An SMS has been sent to your mobile number.
        </p>
        <div className="flex gap-3">
          <Link to={`/track-complaint?id=${result.complaintId}`} className="flex-1 btn-secondary justify-center text-sm">
            Track Complaint
          </Link>
          <Link to="/" className="flex-1 btn-primary justify-center text-sm">Go to Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="hero-gradient py-12 px-4 text-white text-center">
        <h1 className="text-4xl font-black mb-3">Register a Complaint</h1>
        <p className="text-blue-100 max-w-xl mx-auto">Having issues with your water purifier? Fill out the form below and our expert technician will be at your door within 24 hours.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name *</label>
                  <input name="name" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone Number *</label>
                  <input name="phone" className="form-input" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} required maxLength={10} pattern="[0-9]{10}" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</label>
                  <input name="email" type="email" className="form-input" placeholder="your@email.com (optional)" value={form.email} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                Service Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Address *</label>
                  <textarea name="address" className="form-input resize-none" rows={2} placeholder="House/Flat No., Street, Area" value={form.address} onChange={handleChange} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">City</label>
                  <input name="city" className="form-input" placeholder="City" value={form.city} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Pincode</label>
                  <input name="pincode" className="form-input" placeholder="6-digit pincode" value={form.pincode} onChange={handleChange} maxLength={6} />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                Product Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Product Brand</label>
                  <select name="productBrand" className="form-input" value={form.productBrand} onChange={handleChange}>
                    <option value="">Select brand</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Product Model</label>
                  <input name="productModel" className="form-input" placeholder="e.g. Kent Grand Plus" value={form.productModel} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Issue */}
            <div>
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</span>
                Issue Details
              </h2>
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Issue Type *</label>
                <div className="flex flex-wrap gap-2">
                  {ISSUE_TYPES.map(issue => (
                    <button key={issue} type="button"
                      onClick={() => setForm(f => ({ ...f, issueType: f.issueType === issue ? '' : issue }))}
                      className={`filter-chip ${form.issueType === issue ? 'active' : ''}`}>
                      {issue}
                    </button>
                  ))}
                </div>
                {!form.issueType && <p className="text-xs text-red-400 mt-1">Please select an issue type</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Describe the Issue *</label>
                <textarea name="issueDescription" className="form-input resize-none" rows={4}
                  placeholder="Please describe your issue in detail. When did it start? What have you tried? etc."
                  value={form.issueDescription} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" disabled={submitting || !form.issueType}
              className="btn-primary w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? '⏳ Registering Complaint...' : '🎫 Submit Complaint'}
            </button>
          </form>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: '⚡', title: '24-Hour Response', desc: 'Our technician will contact you within 24 hours' },
            { icon: '🔧', title: 'Expert Technicians', desc: 'Certified professionals for all major brands' },
            { icon: '📱', title: 'SMS Updates', desc: 'Get real-time updates via SMS on your complaint status' },
          ].map(card => (
            <div key={card.title} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <div className="text-3xl mb-2">{card.icon}</div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-slate-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Complaint;
