import React from 'react';
import { MinusIcon } from 'lucide-react';

const FilterPanel = ({ categories, filters, onFilterChange, priceRange, onClearFilters }) => {
  const handleCategoryChange = (category) => {
    onFilterChange({ category });
  };

  const handlePriceChange = (min, max) => {
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const handleInStockChange = (inStock) => {
    onFilterChange({ inStock });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              filters.category === 'all'
                ? 'bg-gold-primary text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category.toLowerCase())}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                filters.category === category.toLowerCase()
                  ? 'bg-gold-primary text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange(e.target.value || null, filters.maxPrice)}
              placeholder="Min"
              className="w-full px-3 py-2 border rounded-md"
            />
            <MinusIcon size={16} className="text-gray-400" />
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange(filters.minPrice, e.target.value || null)}
              placeholder="Max"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="text-sm text-gray-500">
            Range: ${priceRange[0]} - ${priceRange[1]}
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => handleInStockChange(e.target.checked)}
            className="rounded border-gray-300 text-gold-primary focus:ring-gold-primary"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClearFilters}
        className="w-full py-2 text-gold-primary hover:text-gold-600 font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterPanel;
