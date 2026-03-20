import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearchChange }) => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = use7842809475Ref();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
  };

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      {/* Top bar */}
      <div style={{ background: 'linear-gradient(135deg, #0277e0, #014687)' }} className="py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6 text-xs text-blue-100">
            <span>📞 +91 7842809475</span>
            <span>✉️ support@bluedrop.in</span>
            <span>🕐 Mon–Sat 9AM–7PM</span>
          </div>
          <div className="text-xs text-blue-100 flex gap-4">
            <Link to="/track-complaint" className="hover:text-white transition-colors">Track Complaint</Link>
            <span className="text-blue-300">|</span>
            {isAdmin && <Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md"
              style={{ background: 'linear-gradient(135deg, #0277e0, #014687)' }}>
              💧
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-slate-800 leading-tight">BlueDrop</div>
              <div className="text-xs text-blue-600 font-medium leading-tight">Water Solutions</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className={`flex-1 max-w-xl hidden md:flex items-center gap-2 rounded-full border-2 px-4 py-2 bg-slate-50 transition-all ${searchFocused ? 'border-blue-500 bg-white shadow-md' : 'border-slate-200'}`}>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400"
              placeholder="Search purifiers, spare parts, brands..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchVal && (
              <button type="button" onClick={() => setSearchVal('')} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            )}
          </form>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            <Link to="/products" className={`nav-link ${isActive('/products')}`}>Products</Link>
            <Link to="/complaint" className={`nav-link ${isActive('/complaint')}`}>Register Complaint</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-blue-50 transition-colors">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5m12-5l2 5M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold animate-bounce-in"
                  style={{ background: '#0277e0' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-blue-50 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #0277e0, #00b4d8)' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-24 truncate">{user.name}</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-slide-up z-50">
                    <div className="px-4 py-3 bg-blue-50 border-b border-slate-100">
                      <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 transition-colors" onClick={() => setDropdownOpen(false)}>
                      <span>📦</span> My Orders
                    </Link>
                    <Link to="/my-complaints" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 transition-colors" onClick={() => setDropdownOpen(false)}>
                      <span>🔧</span> My Complaints
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-sm text-blue-700 font-medium transition-colors" onClick={() => setDropdownOpen(false)}>
                        <span>⚙️</span> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-600 transition-colors border-t border-slate-100">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden sm:flex">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-slate-100 mt-3 animate-slide-up">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-3 rounded-full border border-slate-200 px-3 py-2 bg-slate-50">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input className="flex-1 bg-transparent text-sm outline-none" placeholder="Search products..."
                value={searchVal} onChange={e => setSearchVal(e.target.value)} />
            </form>
            <div className="flex flex-col gap-1">
              <Link to="/" className="nav-link">🏠 Home</Link>
              <Link to="/products" className="nav-link">🛒 Products</Link>
              <Link to="/complaint" className="nav-link">🔧 Register Complaint</Link>
              <Link to="/track-complaint" className="nav-link">📍 Track Complaint</Link>
              <Link to="/contact" className="nav-link">📞 Contact</Link>
              {!user && <Link to="/login" className="nav-link text-blue-600 font-semibold">👤 Login / Register</Link>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
