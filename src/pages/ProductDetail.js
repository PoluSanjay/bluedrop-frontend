import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/ProductCard';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          productAPI.getOne(id),
          reviewAPI.getForProduct(id)
        ]);
        setProduct(pRes.data);
        setReviews(rRes.data);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to submit a review'); return; }
    setSubmittingReview(true);
    try {
      const res = await reviewAPI.add({ productId: id, ...reviewForm });
      setReviews(prev => [res.data, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="skeleton h-96 rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton h-10 w-1/3" />
          <div className="skeleton h-32" />
          <div className="skeleton h-12" />
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>›</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-blue-600">{product.category}</Link>
          <span>›</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10 mb-10">
          {/* Image */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <div className="relative" style={{ paddingBottom: '100%' }}>
              <img src={product.image} alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { e.target.src = 'https://via.placeholder.com/500?text=No+Image'; }} />
              {discount > 0 && (
                <div className="absolute top-4 left-4 badge text-white"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  -{discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-blue-50 text-blue-700">{product.brand}</span>
              <span className="badge bg-slate-100 text-slate-600">{product.subcategory}</span>
              {product.stock > 0
                ? <span className="badge bg-green-50 text-green-700">✓ In Stock</span>
                : <span className="badge bg-red-50 text-red-700">Out of Stock</span>
              }
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-slate-800 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} size="md" />
              <span className="font-semibold text-slate-700">{product.rating}</span>
              <span className="text-slate-400 text-sm">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 p-4 bg-blue-50 rounded-2xl">
              <span className="text-4xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="badge text-white text-sm" style={{ background: '#22c55e' }}>
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-slate-700">Quantity:</span>
              <div className="flex items-center gap-1 border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors font-bold">−</button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors font-bold">+</button>
              </div>
              <span className="text-sm text-slate-500">{product.stock} available</span>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed justify-center">
                🛒 Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed justify-center">
                ⚡ Buy Now
              </button>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🚚', text: 'Free Delivery' },
                { icon: '🔧', text: 'Free Installation' },
                { icon: '🛡️', text: '1 Year Warranty' },
                { icon: '↩️', text: '7 Day Return' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm text-slate-700">
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {['description', 'specifications', 'reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap transition-colors ${tab === t ? 'text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>
                {t} {t === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-slate-600 leading-relaxed text-base">{product.description}</p>
              </div>
            )}

            {tab === 'specifications' && (
              <div className="max-w-lg">
                <table className="w-full">
                  <tbody>
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b border-slate-50">
                        <td className="py-3 pr-6 text-slate-500 text-sm font-medium w-1/2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td className="py-3 text-slate-800 text-sm font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'reviews' && (
              <div>
                {/* Review summary */}
                <div className="flex items-center gap-6 mb-8 p-6 bg-blue-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-black text-slate-800">{product.rating}</div>
                    <StarRating rating={product.rating} size="md" />
                    <div className="text-sm text-slate-500 mt-1">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="text-slate-500 w-4">{star}★</span>
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-slate-400 w-6 text-xs">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Write review */}
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="mb-8 p-5 border border-slate-200 rounded-2xl">
                    <h3 className="font-bold text-slate-800 mb-4">Write a Review</h3>
                    <div className="flex gap-2 mb-3">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                          className="text-2xl transition-transform hover:scale-110">
                          <span style={{ color: s <= reviewForm.rating ? '#f59e0b' : '#d1d5db' }}>★</span>
                        </button>
                      ))}
                    </div>
                    <input className="form-input mb-3" placeholder="Review title" value={reviewForm.title}
                      onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                    <textarea className="form-input mb-3 resize-none" rows={3} placeholder="Share your experience..."
                      value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      required />
                    <button type="submit" className="btn-primary text-sm" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 text-center">
                    <Link to="/login" className="text-blue-600 font-semibold">Login</Link> to write a review
                  </div>
                )}

                {/* Reviews list */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No reviews yet. Be the first to review!</p>
                  ) : reviews.map(review => (
                    <div key={review._id} className="p-4 border border-slate-100 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-semibold text-slate-800 text-sm">{review.userName || 'User'}</span>
                          {review.verified && <span className="ml-2 badge bg-green-50 text-green-700 text-xs">✓ Verified</span>}
                        </div>
                        <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <StarRating rating={review.rating} />
                      {review.title && <p className="font-medium text-slate-800 text-sm mt-1">{review.title}</p>}
                      <p className="text-slate-600 text-sm mt-1">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
