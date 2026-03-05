import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRight, FaHeadset, FaLock, FaShoppingBag, FaTruck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import { getProducts } from "../api/productApi";
import ProductGrid from "../components/products/ProductGrid";

const FEATURES = [
	{ icon: FaTruck, title: "Free Shipping", desc: "On orders over $50" },
	{ icon: FaLock, title: "Secure Payment", desc: "100% secure transactions" },
	{ icon: FaHeadset, title: "24/7 Support", desc: "Always here to help" },
	{ icon: FaShoppingBag, title: "Easy Returns", desc: "30-day return policy" }
];

export default function HomePage() {
	const [featured, setFeatured] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loadingProducts, setLoadingProducts] = useState(true);
	const [email, setEmail] = useState("");

	useEffect(() => {
		getProducts({ featured: true, limit: 8 })
			.then((res) => setFeatured(res.data.products || res.data || []))
			.catch(() => setFeatured([]))
			.finally(() => setLoadingProducts(false));
		getCategories()
			.then((res) => setCategories((res.data.categories || res.data || []).slice(0, 6)))
			.catch(() => setCategories([]));
	}, []);

	const handleNewsletterSubmit = (e) => {
		e.preventDefault();
		setEmail("");
		toast.success("Thank you for subscribing!");
	};

	return (
		<div>
			{/* Hero */}
			<section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
					<div className="max-w-2xl">
						<span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
							🎉 New Arrivals Every Week
						</span>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
							Shop the Best
							<br />
							<span className="text-blue-200">Deals Online</span>
						</h1>
						<p className="text-blue-100 text-lg mb-8 leading-relaxed">
							Discover thousands of products across all categories. Quality guaranteed with fast delivery right to your
							door.
						</p>
						<div className="flex flex-wrap gap-4">
							<Link
								to="/products"
								className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition shadow-lg"
							>
								Shop Now <FaArrowRight />
							</Link>
							<Link
								to="/products?featured=true"
								className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/30 transition border border-white/30"
							>
								View Featured
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features bar */}
			<section className="bg-white border-b border-gray-100 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{FEATURES.map(({ icon: Icon, title, desc }) => (
							<div key={title} className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
									<Icon className="text-blue-600 text-lg" />
								</div>
								<div>
									<p className="font-semibold text-gray-900 text-sm">{title}</p>
									<p className="text-gray-500 text-xs">{desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Categories */}
			{categories.length > 0 && (
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-2xl font-extrabold text-gray-900">Browse Categories</h2>
							<p className="text-gray-500 mt-1">Find what you're looking for</p>
						</div>
						<Link
							to="/products"
							className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
						>
							All Products <FaArrowRight className="text-xs" />
						</Link>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{categories.map((cat) => (
							<Link
								key={cat._id}
								to={`/products?category=${cat._id}`}
								className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group"
							>
								<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition">
									<FaShoppingBag className="text-blue-600 text-xl" />
								</div>
								<p className="font-medium text-gray-800 text-sm">{cat.name}</p>
								{cat.productCount !== undefined && (
									<p className="text-gray-400 text-xs mt-0.5">{cat.productCount} items</p>
								)}
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Featured Products */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-2xl font-extrabold text-gray-900">Featured Products</h2>
						<p className="text-gray-500 mt-1">Handpicked just for you</p>
					</div>
					<Link
						to="/products"
						className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
					>
						View All <FaArrowRight className="text-xs" />
					</Link>
				</div>
				<ProductGrid products={featured} loading={loadingProducts} />
			</section>

			{/* Newsletter */}
			<section className="bg-blue-600">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
					<h2 className="text-2xl font-extrabold text-white mb-2">Stay in the Loop</h2>
					<p className="text-blue-100 mb-8">Subscribe for exclusive deals and new arrivals</p>
					<form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							className="flex-1 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
						/>
						<button
							type="submit"
							className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition shadow whitespace-nowrap"
						>
							Subscribe
						</button>
					</form>
				</div>
			</section>
		</div>
	);
}
