import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { toast } from 'react-toastify';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await authAPI.login({ email: form.email, password: form.password });
      } else {
        res = await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      }
      login(res.data.token, res.data.user);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 hero-gradient text-white p-12">
        <div className="max-w-sm text-center">
          <div className="text-6xl mb-6">💧</div>
          <h2 className="text-4xl font-black mb-4">BlueDrop Water Solutions</h2>
          <p className="text-blue-100 text-lg mb-8">Your trusted partner for pure, safe drinking water.</p>
          <div className="space-y-4">
            {['✓ Buy from 50+ premium products', '✓ Track your complaints in real-time', '✓ Manage your orders easily', '✓ Book AMC & service plans'].map(item => (
              <div key={item} className="flex items-center gap-3 text-left">
                <span className="text-green-300 text-lg">{item.split(' ')[0]}</span>
                <span className="text-blue-100">{item.substring(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          {/* Logo on mobile */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white"
              style={{ background: 'linear-gradient(135deg, #0277e0, #014687)' }}>💧</div>
            <span className="font-black text-xl text-slate-800">BlueDrop</span>
          </Link>

          <h1 className="text-3xl font-black text-slate-800 mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-slate-500 mb-8">
            {isLogin ? "Login to manage your orders and complaints." : "Join thousands of happy customers today."}
          </p>

          {/* Tab toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isLogin ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}>
              Login
            </button>
            <button onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!isLogin ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
                <input name="name" className="form-input" placeholder="Your full name"
                  value={form.name} onChange={handleChange} required={!isLogin} />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</label>
              <input name="email" type="email" className="form-input" placeholder="your@email.com"
                value={form.email} onChange={handleChange} required />
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone Number</label>
                <input name="phone" className="form-input" placeholder="10-digit mobile number"
                  value={form.phone} onChange={handleChange} required={!isLogin} maxLength={10} />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <input name="password" type="password" className="form-input" placeholder="••••••••"
                value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Confirm Password</label>
                <input name="confirmPassword" type="password" className="form-input" placeholder="••••••••"
                  value={form.confirmPassword} onChange={handleChange} required={!isLogin} />
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? '⏳ Please wait...' : isLogin ? '🔑 Login' : '🚀 Create Account'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500">
                Demo Admin: <strong>admin@bluedrop.com</strong> / <strong>Admin@123</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
