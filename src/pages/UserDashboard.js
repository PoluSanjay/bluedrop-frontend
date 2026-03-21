import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  placed: 'status-placed', confirmed: 'status-progress', processing: 'status-progress',
  shipped: 'status-shipped', delivered: 'status-resolved', cancelled: 'status-cancelled'
};

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    orderAPI.getMyOrders().then(res => setOrders(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [user, navigate]);

  const handleCancel = async (orderId) => {
    try {
      await orderAPI.cancel(orderId);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    }
  };

  const orderStats = {
    total: orders.length,
    active: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="hero-gradient text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black">Hello, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-blue-200 text-sm">{user?.email} · {user?.phone}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Total Orders', value: orderStats.total },
              { label: 'Active Orders', value: orderStats.active },
              { label: 'Delivered', value: orderStats.delivered },
            ].map(stat => (
              <div key={stat.label} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-blue-200 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-2">
        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: '🛒', label: 'Shop Now', to: '/products' },
            { icon: '🔧', label: 'Raise Complaint', to: '/complaint' },
            { icon: '📍', label: 'Track Complaint', to: '/track-complaint' },
            { icon: '📞', label: 'Contact Us', to: '/contact' },
          ].map(item => (
            <Link key={item.label} to={item.to}
              className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs font-semibold text-slate-700">{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'orders' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>
              📦 My Orders ({orders.length})
            </button>
            <button onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'profile' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>
              👤 Profile
            </button>
          </div>

          <div className="p-5">
            {activeTab === 'orders' && (
              loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="font-bold text-slate-700 mb-2">No Orders Yet</h3>
                  <p className="text-slate-500 text-sm mb-5">Start shopping to see your orders here.</p>
                  <Link to="/products" className="btn-primary text-sm">Browse Products</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="border border-slate-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">#{order.orderId}</p>
                          <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <span className={`badge text-xs ${STATUS_COLORS[order.status] || 'status-pending'}`}>{order.status}</span>
                          <p className="font-bold text-slate-900 text-sm mt-1">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto mb-3">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1.5 whitespace-nowrap">
                            <img src={item.image} alt={item.name} className="w-6 h-6 rounded object-cover"
                              onError={e => { e.target.src = 'https://via.placeholder.com/24?text=N'; }} />
                            <span className="text-xs text-slate-700 max-w-24 truncate">{item.name}</span>
                            <span className="text-xs text-slate-400">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && <span className="text-xs text-slate-400 py-1">+{order.items.length - 3} more</span>}
                      </div>
                      <div className="flex gap-2">
                        {['placed', 'confirmed', 'processing'].includes(order.status) && (
                          <button onClick={() => handleCancel(order._id)}
                            className="text-xs text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors">
                            Cancel Order
                          </button>
                        )}
                        <span className="text-xs text-slate-400 py-1.5 ml-auto">{order.paymentMethod?.toUpperCase()} · {order.paymentStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'profile' && (
              <div className="max-w-md space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Full Name</p>
                    <p className="font-semibold text-slate-800">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="font-semibold text-slate-800 text-sm">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="font-semibold text-slate-800">{user?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Account Type</p>
                    <p className="font-semibold text-slate-800 capitalize">{user?.role}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                  <p className="font-semibold mb-1">💡 Need help?</p>
                  <p className="text-blue-600">Contact us at <strong>+91 7842809475</strong> or WhatsApp us for instant support.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
