import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const StarRating = ({ rating, size = 'sm' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? 'star-filled' : 'star-empty'}
        style={{ fontSize: size === 'sm' ? '12px' : '16px' }}>★</span>
    );
  }
  return <span className="inline-flex">{stars}</span>;
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card group">
      <Link to={`/products/${product._id}`}>
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: '200px', background: '#f8fafc' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 badge text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="absolute top-3 right-3 badge text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              ⭐ Featured
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="badge bg-red-100 text-red-600">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {product.brand}
            </span>
            <span className="text-xs text-slate-400">{product.subcategory}</span>
          </div>

          <h3 className="font-semibold text-slate-800 text-sm mt-2 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={product.rating} />
            <span className="text-xs text-slate-500">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: product.stock === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #0277e0, #014687)',
              color: product.stock === 0 ? '#94a3b8' : 'white',
              boxShadow: product.stock === 0 ? 'none' : '0 4px 12px rgba(2,119,224,0.3)'
            }}
          >
            {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </Link>
    </div>
  );
};

export { StarRating };
export default ProductCard;
