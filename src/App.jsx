import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
      <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
      <Route path="/cart" element={<Layout><CartPage /></Layout>} />
      <Route path="/checkout" element={<Layout><ProtectedRoute><CheckoutPage /></ProtectedRoute></Layout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<Layout><ProtectedRoute><ProfilePage /></ProtectedRoute></Layout>} />
      <Route path="/orders" element={<Layout><ProtectedRoute><OrdersPage /></ProtectedRoute></Layout>} />
      <Route path="/orders/:id" element={<Layout><ProtectedRoute><OrderDetailPage /></ProtectedRoute></Layout>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
