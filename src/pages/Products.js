import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const BRANDS = ['BlueDrop', 'Kent', 'Aquaguard', 'Livpure'];
const CATEGORIES = ['Water Purifiers', 'Spare Parts'];
const SUBCATEGORIES = {
  'Water Purifiers': ['RO', 'UV', 'UF'],
  'Spare Parts': ['Motor', 'SV', 'Carbon Filter', 'Sediment Filter', 'Post Carbon', 'Membrane']
};
const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    brand: searchParams.get('brand') || '',
    minPrice: '',
    maxPrice: '',
    search: searchParams.get('search') || '',
    sort: '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.subcategory) params.subcategory = filters.subcategory;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      const res = await productAPI.getAll(params);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    setFilters(f => ({
      ...f,
      category: searchParams.get('category') || '',
      subcategory: searchParams.get('subcategory') || '',
      brand: searchParams.get('brand') || '',
      search: searchParams.get('search') || '',
    }));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  const clearFilters = () => setFilters({ category: '', subcategory: '', brand: '', minPrice: '', maxPrice: '', search: '', sort: '' });

  const activeFiltersCount = [filters.category, filters.subcategory, filters.brand, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {activeFiltersCount > 0 && (
        <button onClick={clearFilters} className="w-full py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
          Clear All Filters ({activeFiltersCount})
        </button>
      )}

      {/* Category */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Category</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={filters.category === cat}
                onChange={() => updateFilter('category', cat)}
                className="w-4 h-4 accent-blue-600 rounded" />
              <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategory */}
      {filters.category && SUBCATEGORIES[filters.category] && (
        <div>
          <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Type</h3>
          <div className="flex flex-wrap gap-2">
            {SUBCATEGORIES[filters.category].map(sub => (
              <button key={sub} onClick={() => updateFilter('subcategory', sub)}
                className={`filter-chip ${filters.subcategory === sub ? 'active' : ''}`}>
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Brand</h3>
        <div className="flex flex-col gap-2">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={filters.brand === brand}
                onChange={() => updateFilter('brand', brand)}
                className="w-4 h-4 accent-blue-600 rounded" />
              <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Price Range (₹)</h3>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="form-input text-sm py-2 px-3" />
          <span className="text-slate-400 text-sm">to</span>
          <input type="number" placeholder="Max" value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="form-input text-sm py-2 px-3" />
        </div>
        {/* Quick price filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[['Under ₹500', '', '500'], ['₹500–₹5K', '500', '5000'], ['₹5K–₹15K', '5000', '15000'], ['₹15K+', '15000', '']].map(([label, min, max]) => (
            <button key={label} onClick={() => setFilters(f => ({ ...f, minPrice: min, maxPrice: max }))}
              className="filter-chip text-xs py-1 px-3">
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-800 mb-1">
            {filters.category || 'All Products'}
          </h1>
          <p className="text-slate-500 text-sm">
            {filters.search ? `Search results for "${filters.search}" · ` : ''}
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile filter + sort bar */}
        <div className="flex gap-3 mb-6 lg:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
          <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Mobile filter drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-white rounded-2xl p-5 mb-6 shadow-md border border-slate-100">
            <FilterSidebar />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="font-bold text-slate-800 mb-4">Filters</h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-sm text-slate-500">
                {loading ? 'Loading...' : `Showing ${products.length} results`}
              </p>
              <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
                className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none hover:border-blue-400 cursor-pointer">
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <div className="skeleton h-48" />
                    <div className="p-4 space-y-3">
                      <div className="skeleton h-4 w-3/4" />
                      <div className="skeleton h-4 w-1/2" />
                      <div className="skeleton h-10 w-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Products Found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
