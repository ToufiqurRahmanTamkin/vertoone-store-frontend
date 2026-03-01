import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { getOrder, cancelOrder } from '../api/orderApi';
import { formatPrice, formatDate, getOrderStatusColor } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getOrder(id)
      .then((res) => setOrder(res.data.order || res.data))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    setShowConfirm(false);
    try {
      const res = await cancelOrder(id);
      setOrder(res.data.order || res.data);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!order) return <div className="max-w-5xl mx-auto px-4 py-16 text-center"><p className="text-gray-500">Order not found</p><Link to="/orders" className="text-blue-600 hover:underline mt-2 block">Back to Orders</Link></div>;

  const statusIndex = STEPS.indexOf(order.status?.toLowerCase()) ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium">
        <FaArrowLeft className="text-sm" /> Back to Orders
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Order Details</h1>
          <p className="text-gray-500 text-sm mt-1">#{order._id?.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full ${getOrderStatusColor(order.status)}`}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
          </span>
          {['pending', 'processing'].includes(order.status?.toLowerCase()) && (
            <button onClick={() => setShowConfirm(true)} disabled={cancelling} className="block mt-2 text-sm text-red-500 hover:text-red-700 font-medium ml-auto">
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Progress Tracker */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${(statusIndex / (STEPS.length - 1)) * 100}%` }} />
            </div>
            {STEPS.map((step, i) => (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${i <= statusIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i <= statusIndex ? '✓' : i + 1}
                </div>
                <span className={`text-xs capitalize font-medium ${i <= statusIndex ? 'text-blue-600' : 'text-gray-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Items Ordered</h2>
          <div className="divide-y divide-gray-100">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <img src={item.product?.images?.[0] || item.product?.image || `https://placehold.co/64x64/e5e7eb/9ca3af`} alt={item.product?.name} className="w-16 h-16 object-cover rounded-xl border border-gray-200" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.product?.name || 'Product'}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Address */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal || 0)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping || 0)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPrice(order.tax || 0)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 text-base"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <FaExclamationTriangle className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900">Cancel Order</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium text-sm hover:bg-gray-50 transition">
                Keep Order
              </button>
              <button onClick={handleCancel} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
