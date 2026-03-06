import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { SignupForm } from "./components/SignUpForm";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./hooks/useAuth";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrdersPage from "./pages/OrdersPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import ProfilePage from "./pages/ProfilePage";

function ProtectedRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();
	if (loading) return null;
	return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Layout>
						<HomePage />
					</Layout>
				}
			/>
			<Route
				path="/products"
				element={
					<Layout>
						<ProductsPage />
					</Layout>
				}
			/>
			<Route
				path="/products/:id"
				element={
					<Layout>
						<ProductDetailPage />
					</Layout>
				}
			/>
			<Route
				path="/cart"
				element={
					<Layout>
						<CartPage />
					</Layout>
				}
			/>
			<Route
				path="/checkout"
				element={
					<Layout>
						<ProtectedRoute>
							<CheckoutPage />
						</ProtectedRoute>
					</Layout>
				}
			/>
			<Route
				path="/login"
				element={
					<Layout>
						<LoginPage />
					</Layout>
				}
			/>
			<Route
				path="/register"
				element={
					<Layout>
						<SignupForm />
					</Layout>
				}
			/>
			<Route
				path="/profile"
				element={
					<Layout>
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					</Layout>
				}
			/>
			<Route
				path="/orders"
				element={
					<Layout>
						<ProtectedRoute>
							<OrdersPage />
						</ProtectedRoute>
					</Layout>
				}
			/>
			<Route
				path="/orders/:id"
				element={
					<Layout>
						<ProtectedRoute>
							<OrderDetailPage />
						</ProtectedRoute>
					</Layout>
				}
			/>
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
