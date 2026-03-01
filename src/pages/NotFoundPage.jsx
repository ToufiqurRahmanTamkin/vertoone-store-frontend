import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
            <FaHome /> Go Home
          </Link>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition">
            <FaSearch /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
