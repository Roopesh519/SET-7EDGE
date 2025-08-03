import React from 'react';

const Pagination = ({ currentPage, totalPages, total, onPageChange, itemName }) => {
  return (
    <div className="flex justify-between items-center bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
      <div className="text-sm text-gray-300">
        Showing page {currentPage} of {totalPages} ({total} total {itemName})
      </div>
      <div className="flex space-x-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 text-sm bg-white bg-opacity-20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-30 transition-all duration-200"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 text-sm bg-white bg-opacity-20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-30 transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;