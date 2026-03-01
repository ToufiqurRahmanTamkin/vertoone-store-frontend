import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import StarRating from '../components/common/StarRating';
import Spinner from '../components/common/Spinner';
import { getProduct } from '../api/productApi';
import { useCart } from '../hooks/useCart';
import { formatPrice, formatDate, placeholderImage } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((res) => setProduct(res.data.product || res.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Product Not Found</h2>
      <Link to="/products" className="text-blue-600 hover:underline">Back to Products</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.image || null];

  const handleAddToCart = () => {
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-4">
            <img
              src={images[activeImage] || placeholderImage(product.name, 600, 500)}
              alt={product.name}
              className="w-full h-96 object-contain p-4"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${i === activeImage ? 'border-blue-600' : 'border-gray-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-blue-600 text-sm font-medium uppercase tracking-wide mb-2">
            {product.category?.name || product.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
          <StarRating rating={product.rating || product.averageRating || 0} count={product.numReviews || product.reviewCount} size="lg" />

          <div className="flex items-center gap-3 my-4">
            <span className="text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-0.5 rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock === 0 ? (
              <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full" /> Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock {product.stock <= 10 && `(${product.stock} left)`}
              </span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 transition">
                <FaMinus className="text-xs text-gray-600" />
              </button>
              <span className="px-5 py-3 font-semibold text-gray-800">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} className="p-3 hover:bg-gray-50 transition">
                <FaPlus className="text-xs text-gray-600" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          {/* Meta */}
          {product.brand && <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Brand:</span> {product.brand}</p>}
          {product.sku && <p className="text-sm text-gray-600"><span className="font-medium">SKU:</span> {product.sku}</p>}
        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <div className="mt-10">
        <div className="flex border-b border-gray-200 mb-6">
          {['description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize text-sm transition border-b-2 -mb-px ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} {tab === 'reviews' && product.reviews?.length ? `(${product.reviews.length})` : ''}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            {product.reviews?.length ? (
              <div className="space-y-4">
                {product.reviews.map((review, i) => (
                  <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-bold text-sm">{review.user?.name?.[0] || 'U'}</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
