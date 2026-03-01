import ProductCard from './ProductCard';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import { FaBoxOpen } from 'react-icons/fa';

export default function ProductGrid({ products, loading }) {
  if (loading) return <Spinner size="lg" />;
  if (!products?.length) {
    return (
      <EmptyState
        icon={<FaBoxOpen />}
        title="No products found"
        description="Try adjusting your search or filter criteria"
      />
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
