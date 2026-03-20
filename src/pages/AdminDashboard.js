import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, productAPI, orderAPI, complaintAPI } from '../utils/api';
import { toast } from 'react-toastify';

const PRODUCT_BRANDS = ['BlueDrop', 'Kent', 'Aquaguard', 'Livpure'];
const PRODUCT_CATEGORIES = ['Water Purifiers', 'Spare Parts'];

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productModal, setProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: 'Water Purifiers', subcategory: 'RO', brand: 'BlueDrop', price: '', originalPrice: '', image: '', description: '', stock: '', featured: false });

  useEffect(() => {
    if (!user || !isAdmin) { navigate('/'); return; }
    loadAll();
  }, [user, isAdmin, navigate]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [sRes, pRes, oRes, cRes] = await Promise.all([
        adminAPI.getStats(), productAPI.getAll(), orderAPI.getAll(), complaintAPI.getAll()
      ]);
      setStats(sRes.data);
      setProducts(pRes.data);
      setOrders(oRes.data);
      setComplaints(cRes.data);
    } catch (err) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await productAPI.update(editProduct._id, productForm);
        toast.success('Product updated!');
      } else {
        await productAPI.create(productForm);
        toast.success('Product added!');
      }
      setProductModal(false); setEditProduct(null);
      const pRes = await productAPI.getAll();
      setProducts(pRes.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving product'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await productAPI.delete(id);
    setProducts(prev => prev.filter(p => p._id !== id));
    toast.success('Product deleted');
  };

  const handleOrderStatus = async (id, status) => {
    await orderAPI.updateStatus(id, { status });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    toast.success('Order status updated');
  };

  const handleComplaintStatus = async (id, status, note) => {
    await complaintAPI.update(id, { status, note });
    setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    toast.success('Complaint status updated');
  };

  const openAddProduct = () => {
    setEditProduct(null);
    setProductForm({ name: '', category: 'Water Purifiers', subcategory: 'RO', brand: 'BlueDrop', price: '', originalPrice: '', image: '', description: '', stock: '', featured: false });
    setProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditProduct(p);
    setProductForm({ name: p.name, category: p.category, subcategory: p.subcategory, brand: p.brand, price: p.price, originalPrice: p.originalPrice || '', image: p.image, description: p.description, stock: p.stock, featured: p.featured });
    setProductModal(true);
  };

  const StatBox = ({ label, value, icon, color }) => (
    <div className={`${color} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-black text-slate-800">{value}</p>
      <p className="text-slate-500 text-sm mt-1">{label}</p>
    </div>
  );

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'products', label: '🛒 Products' },
    { id: 'orders', label: '📦 Orders' },
    { id: 'complaints', label: '🔧 Complaints' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="hero-gradient text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Admin Dashboard</h1>
            <p className="text-blue-200 text-sm">BlueDrop Water Solutions</p>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'bg-white text-blue-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* Overview */}
            {tab === 'overview' && stats && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatBox label="Total Orders" value={stats.totalOrders} icon="📦" color="bg-blue-50" />
                  <StatBox label="Products" value={stats.totalProducts} icon="🛒" color="bg-green-50" />
                  <StatBox label="Complaints" value={stats.totalComplaints} icon="🔧" color="bg-orange-50" />
                  <StatBox label="Customers" value={stats.totalUsers} icon="👥" color="bg-purple-50" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Recent Orders</h3>
                    {stats.recentOrders?.map(order => (
                      <div key={order._id} className="flex justify-between items-center py-3 border-b border-slate-50">
                        <div>
                          <p className="font-semibold text-sm text-slate-800">#{order.orderId}</p>
                          <p className="text-xs text-slate-400">{order.user?.name}</p>
                        </div>
                        <span className={`badge text-xs status-${order.status}`}>{order.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Pending Complaints</h3>
                    <div className="text-center py-4">
                      <p className="text-5xl font-black text-orange-500">{stats.pendingComplaints}</p>
                      <p className="text-slate-500 text-sm mt-1">Awaiting resolution</p>
                      <button onClick={() => setTab('complaints')} className="btn-primary text-sm mt-4">Manage Complaints</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            {tab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-slate-800">Products ({products.length})</h2>
                  <button onClick={openAddProduct} className="btn-primary text-sm">+ Add Product</button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {['Product', 'Category', 'Brand', 'Price', 'Stock', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover"
                                  onError={e => { e.target.src = 'https://via.placeholder.com/40'; }} />
                                <span className="font-medium text-sm text-slate-800 max-w-36 truncate">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">{p.subcategory}</td>
                            <td className="px-4 py-3"><span className="badge bg-blue-50 text-blue-700 text-xs">{p.brand}</span></td>
                            <td className="px-4 py-3 font-semibold text-sm">₹{p.price?.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3"><span className={`text-sm font-semibold ${p.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{p.stock}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openEditProduct(p)} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                                <button onClick={() => handleDeleteProduct(p._id)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-5">Orders ({orders.length})</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-sm text-blue-700 font-semibold">#{order.orderId}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{order.user?.name || 'N/A'}</td>
                            <td className="px-4 py-3 font-semibold text-sm">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3"><span className="badge bg-slate-100 text-slate-600 text-xs">{order.paymentMethod}</span></td>
                            <td className="px-4 py-3">
                              <span className={`badge text-xs status-${order.status}`}>{order.status}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td className="px-4 py-3">
                              <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none"
                                value={order.status} onChange={e => handleOrderStatus(order._id, e.target.value)}>
                                {['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Complaints */}
            {tab === 'complaints' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-5">Complaints ({complaints.length})</h2>
                <div className="space-y-3">
                  {complaints.map(c => (
                    <div key={c._id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                      <div className="flex flex-wrap justify-between gap-3 mb-3">
                        <div>
                          <span className="font-mono font-bold text-blue-700 text-sm">{c.complaintId}</span>
                          <h3 className="font-bold text-slate-800">{c.name} · {c.phone}</h3>
                          <p className="text-sm text-slate-500">{c.address}, {c.city}</p>
                        </div>
                        <div className="text-right">
                          <span className={`badge text-xs ${
                            c.status === 'Pending' ? 'status-pending' :
                            c.status === 'In Progress' ? 'status-progress' :
                            c.status === 'Resolved' ? 'status-resolved' : 'status-cancelled'
                          }`}>{c.status}</span>
                          <p className="text-xs text-slate-400 mt-1">{new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        <span className="font-medium">{c.issueType}</span>: {c.issueDescription}
                      </p>
                      {c.productBrand && <p className="text-xs text-slate-400 mb-3">Product: {c.productBrand} {c.productModel}</p>}
                      <div className="flex flex-wrap gap-2 items-center">
                        <select className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 outline-none"
                          value={c.status} onChange={e => handleComplaintStatus(c._id, e.target.value, `Status changed to ${e.target.value}`)}>
                          {['Pending', 'In Progress', 'Resolved', 'Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ComplaintTechnicianInput complaintId={c._id} currentTech={c.assignedTechnicianName} onSave={(tech) => handleComplaintStatus(c._id, c.status, `Assigned to ${tech}`)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product modal */}
      {productModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setProductModal(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-screen overflow-y-auto animate-bounce-in">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-slate-800 text-xl">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setProductModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <input className="form-input" placeholder="Product Name *" value={productForm.name}
                onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required />
              <div className="grid grid-cols-2 gap-3">
                <select className="form-input" value={productForm.category}
                  onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}>
                  {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="form-input" placeholder="Subcategory (e.g. RO, UV)" value={productForm.subcategory}
                  onChange={e => setProductForm(f => ({ ...f, subcategory: e.target.value }))} required />
              </div>
              <select className="form-input" value={productForm.brand}
                onChange={e => setProductForm(f => ({ ...f, brand: e.target.value }))}>
                {PRODUCT_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input className="form-input" type="number" placeholder="Price (₹) *" value={productForm.price}
                  onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} required />
                <input className="form-input" type="number" placeholder="Original Price (₹)" value={productForm.originalPrice}
                  onChange={e => setProductForm(f => ({ ...f, originalPrice: e.target.value }))} />
              </div>
              <input className="form-input" placeholder="Image URL" value={productForm.image}
                onChange={e => setProductForm(f => ({ ...f, image: e.target.value }))} />
              <textarea className="form-input resize-none" rows={3} placeholder="Description *" value={productForm.description}
                onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} required />
              <input className="form-input" type="number" placeholder="Stock Quantity" value={productForm.stock}
                onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm(f => ({ ...f, featured: e.target.checked }))} className="accent-blue-600 w-4 h-4" />
                <span className="text-sm font-medium text-slate-700">Featured Product</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setProductModal(false)} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center text-sm">
                  {editProduct ? '💾 Update' : '+ Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ComplaintTechnicianInput = ({ complaintId, currentTech, onSave }) => {
  const [tech, setTech] = useState(currentTech || '');
  return (
    <div className="flex gap-2">
      <input className="form-input text-xs py-1.5 px-3" placeholder="Assign technician name"
        value={tech} onChange={e => setTech(e.target.value)} style={{ width: '180px' }} />
      <button type="button" onClick={() => onSave(tech)}
        className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
        Assign
      </button>
    </div>
  );
};

export default AdminDashboard;
