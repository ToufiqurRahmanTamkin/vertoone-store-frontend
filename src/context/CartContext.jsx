import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getCart, addToCart as addToCartApi, updateCartItem, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '../api/cartApi';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      const saved = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(saved);
      return;
    }
    setLoading(true);
    try {
      const res = await getCart();
      setItems(res.data.items || res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!isAuthenticated) {
      setItems((prev) => {
        const existing = prev.find((i) => i.product._id === product._id);
        let updated;
        if (existing) {
          updated = prev.map((i) =>
            i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          updated = [...prev, { product, quantity }];
        }
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
      toast.success('Added to cart');
      return;
    }
    try {
      await addToCartApi({ productId: product._id, quantity });
      await fetchCart();
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  }, [isAuthenticated, fetchCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return;
    if (!isAuthenticated) {
      setItems((prev) => {
        const updated = prev.map((i) =>
          (i.product._id === itemId || i._id === itemId) ? { ...i, quantity } : i
        );
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
      return;
    }
    try {
      await updateCartItem(itemId, { quantity });
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  }, [isAuthenticated, fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
    if (!isAuthenticated) {
      setItems((prev) => {
        const updated = prev.filter((i) => i.product._id !== itemId && i._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
      toast.success('Removed from cart');
      return;
    }
    try {
      await removeFromCartApi(itemId);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove from cart');
    }
  }, [isAuthenticated, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      localStorage.removeItem('cart');
      return;
    }
    try {
      await clearCartApi();
      setItems([]);
    } catch {
      toast.error('Failed to clear cart');
    }
  }, [isAuthenticated]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
