import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const ServiceCard = ({ icon, title, desc, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110 ${color}`}>
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const StatCard = ({ value, label, icon }) => (
  <div className="text-center">
    <div className="text-4xl mb-1">{icon}</div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-blue-200 text-sm">{label}</div>
  </div>
);

const BrandBadge = ({ brand, logo }) => (
  <Link to={`/products?brand=${brand}`}
    className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all hover:-translate-y-1">
    <div className="text-3xl">{logo}</div>
    <span className="text-sm font-semibold text-slate-700">{brand}</span>
  </Link>
);

const TestimonialCard = ({ name, location, text, rating }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < rating ? '#f59e0b' : '#e2e8f0', fontSize: '16px' }}>★</span>
      ))}
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-4">"{text}"</p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ background: 'linear-gradient(135deg, #0277e0, #014687)' }}>
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-sm text-slate-800">{name}</p>
        <p className="text-xs text-slate-400">{location}</p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complaintId, setComplaintId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getAll({ featured: true }).then(res => {
      setFeaturedProducts(res.data.slice(0, 4));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (complaintId.trim()) navigate(`/track-complaint?id=${complaintId.trim()}`);
  };

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0277e0 0%, #014687 55%, #003266 100%)',
        minHeight: '92vh'
      }}>
        {/* Animated water circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full opacity-10"
              style={{
                width: `${180 + i * 90}px`, height: `${180 + i * 90}px`,
                border: '1px solid rgba(255,255,255,0.4)',
                top: '50%', left: '50%',
                transform: `translate(-50%, -50%)`,
                animation: `ripple ${3 + i}s ease-out ${i * 0.5}s infinite`
              }}
            />
          ))}
          {/* Floating drops */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute text-white/10 text-5xl select-none"
              style={{
                top: `${10 + (i * 11) % 80}%`,
                left: `${5 + (i * 13) % 90}%`,
                animation: `float ${4 + i * 0.7}s ease-in-out ${i * 0.3}s infinite`,
                fontSize: `${30 + i * 8}px`
              }}>
              💧
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left content */}
            <div className="text-white animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium border border-white/25">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Trusted by 10,000+ Families
              </div>
              <h1 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
                Pure Water,
                <br />
                <span className="text-transparent" style={{
                  WebkitTextStroke: '2px rgba(255,255,255,0.7)'
                }}>Better</span>
                <span style={{
                  background: 'linear-gradient(135deg, #7dd3fc, #e0f2fe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}> Life</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-lg">
                India's most trusted water purifier brand. Expert installation, AMC service, and 24/7 support across Hyderabad.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/products" className="btn-primary bg-white text-blue-700 hover:bg-blue-50"
                  style={{ background: 'white', color: '#0277e0', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  🛒 Shop Now
                </Link>
                <Link to="/complaint" className="btn-secondary border-white/50 text-white hover:bg-white/20"
                  style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                  🔧 Register Complaint
                </Link>
              </div>

              {/* Quick track */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-md">
                <p className="text-sm text-blue-100 mb-2 font-medium">📍 Track your complaint</p>
                <form onSubmit={handleTrack} className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl px-3 py-2 text-sm bg-white/20 border border-white/30 text-white placeholder-blue-200 outline-none focus:border-white/60"
                    placeholder="Enter Complaint ID (e.g. CMP240101XXXX)"
                    value={complaintId}
                    onChange={e => setComplaintId(e.target.value)}
                  />
                  <button type="submit" className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors whitespace-nowrap">
                    Track
                  </button>
                </form>
              </div>
            </div>

            {/* Right visual */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative animate-float">
                {/* Main purifier visual */}
                <div className="w-72 h-80 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))' }}>
                  <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
                    alt="Water Purifier"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6"
                    style={{ background: 'linear-gradient(to top, rgba(1,70,135,0.8), transparent)' }}>
                    <p className="text-white font-bold text-lg">BlueDrop SmartPure RO</p>
                    <p className="text-blue-200 text-sm">7-Stage Purification</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-2xl font-black text-white">₹8,999</span>
                      <span className="text-blue-300 line-through text-sm">₹12,999</span>
                      <span className="badge text-white text-xs" style={{ background: '#ef4444' }}>-31%</span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-2xl px-3 py-2 text-xs font-bold shadow-lg">
                  ✓ ISO Certified
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-3 py-2 shadow-xl">
                  <p className="text-blue-700 font-bold text-xs">🛡️ 1 Year Warranty</p>
                  <p className="text-slate-500 text-xs">Free Installation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80V40C240 0 480 60 720 40C960 20 1200 0 1440 40V80H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'linear-gradient(135deg, #0277e0, #014687)' }} className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="10K+" label="Happy Customers" icon="😊" />
            <StatCard value="50+" label="Products Available" icon="🛒" />
            <StatCard value="15+" label="Years Experience" icon="🏆" />
            <StatCard value="24/7" label="Customer Support" icon="📞" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge bg-blue-50 text-blue-700 mb-3">Our Services</span>
            <h2 className="text-4xl font-black text-slate-800 mb-3">Everything You Need</h2>
            <p className="text-slate-500 max-w-xl mx-auto">From buying a purifier to maintenance – we've got you covered at every step.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard icon="💧" title="Water Purifiers" desc="Shop RO, UV, UF purifiers from top brands like Kent, Aquaguard, Livpure, and our own BlueDrop range." color="bg-blue-50" />
            <ServiceCard icon="🔧" title="Installation" desc="Expert installation by certified technicians. We ensure your purifier works perfectly from day one." color="bg-green-50" />
            <ServiceCard icon="🛠️" title="Repair Service" desc="Fast and affordable repair for all brands. Most issues resolved within 24 hours of complaint." color="bg-orange-50" />
            <ServiceCard icon="📋" title="AMC Plans" desc="Annual Maintenance Contract for worry-free purification. Regular filter changes and free service visits." color="bg-purple-50" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge bg-blue-50 text-blue-700 mb-2 block w-fit">Featured Products</span>
              <h2 className="text-4xl font-black text-slate-800">Best Sellers</h2>
            </div>
            <Link to="/products" className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton h-48 mb-0" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-8 w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Top Brands We Carry</h2>
            <p className="text-slate-500">Authorized dealer for all leading water purifier brands</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <BrandBadge brand="BlueDrop" logo="💧" />
            <BrandBadge brand="Kent" logo="🔵" />
            <BrandBadge brand="Aquaguard" logo="🟢" />
            <BrandBadge brand="Livpure" logo="🌊" />
          </div>
        </div>
      </section>

      {/* Spare Parts CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0277e0 0%, #014687 100%)' }}>
            <div className="grid md:grid-cols-2 gap-8 p-10 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-black mb-3">Need Spare Parts?</h2>
                <p className="text-blue-100 mb-6">Get genuine filters, membranes, motors, and more for all major brands. Fast delivery available.</p>
                <div className="flex flex-wrap gap-3">
                  {['RO Membrane', 'Sediment Filter', 'Carbon Filter', 'Booster Pump', 'Solenoid Valve'].map(part => (
                    <Link key={part} to={`/products?subcategory=${part}&category=Spare Parts`}
                      className="px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/30 rounded-full text-sm text-white transition-colors">
                      {part}
                    </Link>
                  ))}
                </div>
                <Link to="/products?category=Spare Parts" className="inline-flex items-center gap-2 mt-6 bg-white text-blue-700 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
                  Shop Spare Parts →
                </Link>
              </div>
              <div className="hidden md:grid grid-cols-3 gap-3">
                {[
                  { name: 'RO Membrane', price: '₹850', icon: '🔵' },
                  { name: 'Sediment Filter', price: '₹120', icon: '🟡' },
                  { name: 'Carbon Filter', price: '₹180', icon: '⚫' },
                  { name: 'Booster Pump', price: '₹650', icon: '⚙️' },
                  { name: 'Post Carbon', price: '₹150', icon: '🟠' },
                  { name: 'Solenoid Valve', price: '₹220', icon: '🔩' },
                ].map(item => (
                  <div key={item.name} className="bg-white/10 rounded-xl p-3 text-center border border-white/20">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-white text-xs font-medium">{item.name}</p>
                    <p className="text-blue-200 text-sm font-bold">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-800 mb-3">What Our Customers Say</h2>
            <p className="text-slate-500">Trusted by thousands of families across Hyderabad</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard name="Rahul Sharma" location="Kukatpally, Hyderabad" rating={5}
              text="Excellent service! Got my Kent RO installed within 2 hours of ordering. The technician was professional and explained everything clearly." />
            <TestimonialCard name="Priya Reddy" location="Madhapur, Hyderabad" rating={5}
              text="My BlueDrop SmartPure has been running for 2 years without any issues. Their AMC service is worth every rupee!" />
            <TestimonialCard name="Mohammed Irfan" location="LB Nagar, Hyderabad" rating={4}
              text="Quick complaint resolution. Registered complaint at 10 AM, technician arrived by 3 PM. Highly recommend!" />
          </div>
        </div>
      </section>

      {/* Service CTA Banner */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4">Water Purifier Not Working?</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">Register a complaint and our expert technician will be at your door within 24 hours.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/complaint" className="btn-primary">🔧 Register Complaint Now</Link>
            <a href="tel:+917842809475" className="btn-secondary">📞 Call Us Now</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
