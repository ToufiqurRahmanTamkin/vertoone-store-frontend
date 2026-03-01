import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating = 0, count, size = 'sm' }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= rating) return 'full';
    if (i + 0.5 <= rating) return 'half';
    return 'empty';
  });
  const cls = size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <div className="flex items-center gap-1">
      <div className={`flex text-yellow-400 ${cls}`}>
        {stars.map((s, i) =>
          s === 'full' ? <FaStar key={i} /> : s === 'half' ? <FaStarHalfAlt key={i} /> : <FaRegStar key={i} />
        )}
      </div>
      {count !== undefined && <span className="text-gray-500 text-xs">({count})</span>}
    </div>
  );
}
