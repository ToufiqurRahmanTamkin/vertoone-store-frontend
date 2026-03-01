import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FaChevronLeft className="text-gray-600" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 rounded-lg border transition font-medium ${
            p === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FaChevronRight className="text-gray-600" />
      </button>
    </div>
  );
}
