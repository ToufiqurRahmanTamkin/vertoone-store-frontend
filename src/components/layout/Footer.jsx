import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">V</span>
              </div>
              <span className="font-extrabold text-xl text-white">Vertoone</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              Your one-stop destination for quality products at great prices. Shop with confidence and enjoy fast, reliable delivery.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-blue-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {['Help Center', 'Returns & Exchanges', 'Shipping Info', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}><a href="#" className="hover:text-blue-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Vertoone Store. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-xs" />
            <span>support@vertoone.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
