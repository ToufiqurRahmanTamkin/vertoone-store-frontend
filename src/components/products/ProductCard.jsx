import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import StarRating from '../common/StarRating';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group border border-gray-100">
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
        <img
          src={product.images?.[0] || product.image || `https://placehold.co/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-full text-sm">Out of Stock</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <p className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">{product.category?.name || product.category}</p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating || product.averageRating || 0} count={product.numReviews || product.reviewCount} />
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
          >
            <FaShoppingCart className="text-xs" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
