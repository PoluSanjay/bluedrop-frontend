import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #0277e0, #014687)' }}>
                💧
              </div>
              <div>
                <div className="font-bold text-white text-lg">BlueDrop</div>
                <div className="text-xs text-blue-400">Water Solutions</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Your trusted partner for clean, safe drinking water. We sell, install, and service water purifiers across the region.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'twitter', 'youtube'].map(platform => (
                <a key={platform} href={`https://${platform}.com`} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-sm transition-colors">
                  {platform === 'facebook' ? '📘' : platform === 'instagram' ? '📷' : platform === 'twitter' ? '🐦' : '▶️'}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/products?category=Water Purifiers', label: 'Water Purifiers' },
                { to: '/products?category=Spare Parts', label: 'Spare Parts' },
                { to: '/complaint', label: 'Register Complaint' },
                { to: '/track-complaint', label: 'Track Complaint' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <span className="text-blue-600">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['RO Water Purifier Installation', 'Annual Maintenance Contract', 'Filter Replacement', 'RO Repair & Service', 'UV/UF System Servicing', 'Free Water Quality Testing'].map(s => (
                <li key={s} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="mt-0.5">📍</span>
                <span className="text-slate-400">Subedari, Hanamkonda 506001, Telangana</span>
              </div>
              <div className="flex items-center gap-3">
                <span>📞</span>
                <a href="tel:+917842809475" className="text-slate-400 hover:text-blue-400">+91 7842809475</a>
              </div>
              <div className="flex items-center gap-3">
                <span>✉️</span>
                <a href="mailto:support@bluedrop.in" className="text-slate-400 hover:text-blue-400">sanjaypolu3@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <span>🕐</span>
                <span className="text-slate-400">Mon–Sat: 9AM – 7PM</span>
              </div>
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/917842809475?text=Hi, I need help with my water purifier"
              target="_blank" rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} BlueDrop Water Solutions. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link to="/refund" className="hover:text-blue-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
