import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaTimes, FaSlidersH } from 'react-icons/fa';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import { getProducts } from '../api/productApi';
import { getCategories } from '../api/categoryApi';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.categories || res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    getProducts(params)
      .then((res) => {
        const data = res.data;
        setProducts(data.products || data || []);
        setTotalPages(data.totalPages || data.pages || 1);
        setTotal(data.total || data.count || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, search, category, sort, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = category || sort || minPrice || maxPrice || search;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {search ? `Results for "${search}"` : 'All Products'}
          </h1>
          {!loading && <p className="text-gray-500 text-sm mt-1">{total} products found</p>}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
        >
          <FaSlidersH /> Filters {hasFilters && <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">!</span>}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                <FaTimes /> Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="No limit"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {search && <FilterTag label={`Search: "${search}"`} onRemove={() => updateParam('search', '')} />}
          {category && categories.length > 0 && <FilterTag label={`Category: ${categories.find(c => c._id === category)?.name || category}`} onRemove={() => updateParam('category', '')} />}
          {sort && <FilterTag label={`Sort: ${SORT_OPTIONS.find(o => o.value === sort)?.label}`} onRemove={() => updateParam('sort', '')} />}
          {minPrice && <FilterTag label={`Min: $${minPrice}`} onRemove={() => updateParam('minPrice', '')} />}
          {maxPrice && <FilterTag label={`Max: $${maxPrice}`} onRemove={() => updateParam('maxPrice', '')} />}
        </div>
      )}

      <ProductGrid products={products} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParam('page', p)} />
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900"><FaTimes className="text-xs" /></button>
    </span>
  );
}
