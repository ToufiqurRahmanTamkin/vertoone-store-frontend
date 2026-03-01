import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { formatPrice, placeholderImage } from '../../utils/helpers';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product || item;
  const itemId = item._id || product._id;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <Link to={`/products/${product._id}`} className="shrink-0">
        <img
          src={product.images?.[0] || product.image || placeholderImage('Img', 80, 80)}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-xl border border-gray-200"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${product._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </Link>
        <p className="text-blue-600 font-medium mt-1">{formatPrice(product.price)}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => updateQuantity(itemId, item.quantity - 1)}
            className="p-2 hover:bg-gray-50 transition"
          >
            <FaMinus className="text-xs text-gray-600" />
          </button>
          <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(itemId, item.quantity + 1)}
            className="p-2 hover:bg-gray-50 transition"
          >
            <FaPlus className="text-xs text-gray-600" />
          </button>
        </div>
        <span className="font-bold text-gray-900 min-w-[5rem] text-right">{formatPrice(product.price * item.quantity)}</span>
        <button
          onClick={() => removeFromCart(itemId)}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
