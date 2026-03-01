import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../api/orderApi';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  if (!isAuthenticated) {
    navigate('/login?redirect=/checkout');
    return null;
  }

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderData = {
        items: items.map((i) => ({ product: i.product?._id || i._id, quantity: i.quantity, price: i.product?.price || i.price })),
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
      };
      const res = await createOrder(orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.order?._id || res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-2">
        <FaLock className="text-blue-600 text-xl" /> Secure Checkout
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address *</label><input name="address" required value={form.address} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input name="city" required value={form.city} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label><input name="state" required value={form.state} onChange={handleChange} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label><input name="zip" required value={form.zip} onChange={handleChange} className={inputClass} /></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select name="country" value={form.country} onChange={handleChange} className={inputClass}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="BD">Bangladesh</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-blue-600" /> Payment Method
              </h2>
              <div className="flex gap-3 mb-4">
                {['card', 'cod'].map((m) => (
                  <label key={m} className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition flex-1 ${form.paymentMethod === m ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input type="radio" name="paymentMethod" value={m} checked={form.paymentMethod === m} onChange={handleChange} className="sr-only" />
                    <span className="font-medium text-sm text-gray-800">{m === 'card' ? '💳 Credit/Debit Card' : '💵 Cash on Delivery'}</span>
                  </label>
                ))}
              </div>
              {form.paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label><input name="cardNumber" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={handleChange} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label><input name="cardExpiry" placeholder="MM/YY" value={form.cardExpiry} onChange={handleChange} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">CVV</label><input name="cardCvv" placeholder="123" value={form.cardCvv} onChange={handleChange} className={inputClass} /></div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id || item.product?._id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate mr-2">{item.product?.name || item.name} × {item.quantity}</span>
                  <span className="font-medium shrink-0">{formatPrice((item.product?.price || item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-3"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              {submitting ? 'Placing Order...' : (<><FaLock className="text-sm" /> Place Order ({formatPrice(total)})</>)}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
