import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=cart, 2=address, 3=payment, 4=success
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: 'Telangana', pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + shipping + tax;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!user) { navigate('/login'); return; }
    setPlacing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id, name: item.name, image: item.image,
          price: item.price, quantity: item.quantity
        })),
        shippingAddress: address,
        totalAmount: grandTotal,
        paymentMethod,
        paymentId: paymentMethod === 'razorpay' ? `rzp_mock_${Date.now()}` : null
      };
      const res = await orderAPI.place(orderData);
      setOrderId(res.data.orderId);
      clearCart();
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order placement failed');
    } finally {
      setPlacing(false);
    }
  };

  if (step === 4) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center animate-bounce-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
          ✓
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Order Placed!</h2>
        <p className="text-slate-500 mb-4">Your order has been placed successfully.</p>
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-500">Order ID</p>
          <p className="text-xl font-bold text-blue-700">{orderId}</p>
        </div>
        <p className="text-sm text-slate-500 mb-6">You'll receive an SMS confirmation on your registered mobile number.</p>
        <div className="flex gap-3">
          <Link to="/dashboard" className="flex-1 btn-secondary justify-center text-sm">Track Order</Link>
          <Link to="/products" className="flex-1 btn-primary justify-center text-sm">Shop More</Link>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-black text-slate-800 mb-3">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8">Add some products to your cart to proceed.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-white border-b border-slate-100 py-5 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-black text-slate-800 mb-3">
            {step === 1 ? 'Shopping Cart' : step === 2 ? 'Delivery Address' : 'Payment'}
          </h1>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {['Cart', 'Address', 'Payment'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 text-sm font-medium ${step > i ? 'text-green-600' : step === i + 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step > i ? 'bg-green-100' : step === i + 1 ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    {step > i ? '✓' : i + 1}
                  </div>
                  {s}
                </div>
                {i < 2 && <div className="w-8 h-0.5 bg-slate-200" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800">{cartItems.length} Items</h2>
                  <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition-colors">
                    Clear All
                  </button>
                </div>
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-4 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0"
                      onError={e => { e.target.src = 'https://via.placeholder.com/80?text=N/A'; }} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-sm mb-1 truncate">{item.name}</h3>
                      <p className="text-xs text-slate-400 mb-2">{item.brand}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 font-bold text-slate-600">−</button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 font-bold text-slate-600">+</button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-400">₹{item.price.toLocaleString('en-IN')} each</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="shrink-0 text-slate-300 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <form onSubmit={handleAddressSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-5">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name *</label>
                    <input className="form-input" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone Number *</label>
                    <input className="form-input" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Street Address *</label>
                    <textarea className="form-input resize-none" rows={2} value={address.street}
                      onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">City *</label>
                    <input className="form-input" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">State</label>
                    <select className="form-input" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}>
                      {['Telangana','Andhra Pradesh','Karnataka','Tamil Nadu','Maharashtra','Kerala','Other'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Pincode *</label>
                    <input className="form-input" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} required maxLength={6} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                  <button type="submit" className="btn-primary flex-1 justify-center">Continue to Payment →</button>
                </div>
              </form>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-5">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {[
                    { value: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'razorpay', icon: '💳', label: 'Pay Online (Razorpay)', desc: 'UPI, Cards, Net Banking – Test Mode' },
                  ].map(method => (
                    <label key={method.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-200'}`}>
                      <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)} className="accent-blue-600 w-4 h-4" />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{method.label}</p>
                        <p className="text-xs text-slate-500">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Address summary */}
                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Delivering to:</p>
                  <p className="font-semibold text-slate-800 text-sm">{address.name} · {address.phone}</p>
                  <p className="text-slate-600 text-sm">{address.street}, {address.city}, {address.state} – {address.pincode}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={placing}
                    className="btn-primary flex-1 justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                    {placing ? '⏳ Placing Order...' : `🎉 Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 flex justify-between font-bold text-slate-900 text-base">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="bg-green-50 rounded-xl px-3 py-2 text-xs text-green-700 font-medium mb-4">
                  🎉 You saved ₹99 on shipping!
                </div>
              )}
              {cartTotal < 999 && (
                <div className="bg-orange-50 rounded-xl px-3 py-2 text-xs text-orange-700 mb-4">
                  Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping
                </div>
              )}

              {step === 1 && (
                <button onClick={() => {
                  if (!user) { navigate('/login?redirect=/cart'); return; }
                  setStep(2);
                }} className="btn-primary w-full justify-center">
                  Proceed to Checkout →
                </button>
              )}

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {['🔒 Secure', '🚚 Fast Delivery', '↩️ Easy Returns'].map(tag => (
                  <span key={tag} className="text-xs text-slate-400">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
