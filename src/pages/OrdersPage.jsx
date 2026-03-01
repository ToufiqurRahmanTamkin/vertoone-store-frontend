import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaArrowRight } from 'react-icons/fa';
import { getOrders } from '../api/orderApi';
import { formatPrice, formatDate, getOrderStatusColor, placeholderImage } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data.orders || res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">My Orders</h1>

      {!orders.length ? (
        <EmptyState
          icon={<FaBox />}
          title="No orders yet"
          description="Once you place an order, it will appear here"
          action={<Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">Start Shopping <FaArrowRight /></Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="block bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order #{order._id?.slice(-8).toUpperCase()}</p>
                  <p className="font-semibold text-gray-900">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900 text-lg">{formatPrice(order.total)}</p>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-1 ${getOrderStatusColor(order.status)}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                  </span>
                </div>
              </div>
              {order.items?.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <img src={item.product?.images?.[0] || item.product?.image || placeholderImage('', 40, 40)} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                </div>
              ))}
              {(order.items?.length || 0) > 2 && <p className="text-xs text-gray-400 mt-1 ml-10">+{order.items.length - 2} more items</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
