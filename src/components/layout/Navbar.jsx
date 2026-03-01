import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaSignOutAlt, FaBox } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">V</span>
            </div>
            <span className="font-extrabold text-xl text-gray-900">Vertoone</span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition">
              <FaShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-sm">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaUser className="text-gray-400" /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaBox className="text-gray-400" /> My Orders
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mt-3 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch />
              </button>
            </form>
            <div className="mt-3 space-y-1">
              <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Products</Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Sign Up</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Profile</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">My Orders</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">Sign Out</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
