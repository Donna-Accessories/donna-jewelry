import React from 'react';
import { useProducts } from '../../hooks/useProducts';

const FilterPanel = ({ selectedCategory, onCategoryChange }) => {
  const { categories = [] } = useProducts();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            !selectedCategory
              ? 'bg-gold-primary text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category.toLowerCase())}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors capitalize ${
              selectedCategory === category.toLowerCase()
                ? 'bg-gold-primary text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
