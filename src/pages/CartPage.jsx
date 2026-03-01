import { Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowRight, FaTrash } from 'react-icons/fa';
import CartItem from '../components/cart/CartItem';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import EmptyState from '../components/common/EmptyState';

export default function CartPage() {
  const { items, clearCart, subtotal, totalItems } = useCart();

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<FaShoppingCart />}
          title="Your cart is empty"
          description="Start shopping to add products to your cart"
          action={<Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">Browse Products <FaArrowRight /></Link>}
        />
      </div>
    );
  }

  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Shopping Cart ({totalItems} items)</h1>
        <button onClick={clearCart} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium">
          <FaTrash /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {items.map((item) => <CartItem key={item._id || item.product?._id} item={item} />)}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                Add {formatPrice(50 - subtotal)} more for free shipping!
              </p>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-center transition"
          >
            Proceed to Checkout
          </Link>
          <Link to="/products" className="block w-full mt-3 text-center text-sm text-gray-500 hover:text-blue-600 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
