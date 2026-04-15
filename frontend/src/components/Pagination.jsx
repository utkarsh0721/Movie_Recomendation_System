import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* First Page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-dark-700 bg-dark-800 text-white
                 hover:bg-dark-700 hover:border-primary-500 disabled:opacity-30 
                 disabled:cursor-not-allowed transition-all duration-300"
        aria-label="First page"
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-dark-700 bg-dark-800 text-white
                 hover:bg-dark-700 hover:border-primary-500 disabled:opacity-30 
                 disabled:cursor-not-allowed transition-all duration-300"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`min-w-[40px] h-10 rounded-lg border transition-all duration-300
            ${page === currentPage
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 border-transparent text-white font-semibold'
              : page === '...'
              ? 'border-transparent text-dark-500 cursor-default'
              : 'border-dark-700 bg-dark-800 text-white hover:bg-dark-700 hover:border-primary-500'
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next Page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-dark-700 bg-dark-800 text-white
                 hover:bg-dark-700 hover:border-primary-500 disabled:opacity-30 
                 disabled:cursor-not-allowed transition-all duration-300"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Last Page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-dark-700 bg-dark-800 text-white
                 hover:bg-dark-700 hover:border-primary-500 disabled:opacity-30 
                 disabled:cursor-not-allowed transition-all duration-300"
        aria-label="Last page"
      >
        <ChevronsRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;