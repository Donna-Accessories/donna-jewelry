// src/pages/Products.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Grid, List, SortAsc } from 'lucide-react';

import ProductGrid from '../components/product/ProductGrid.jsx';
import SearchBar from '../components/search/SearchBar.jsx';
import FilterPanel from '../components/search/FilterPanel.jsx';
import SortOptions from '../components/search/SortOptions.jsx';
import Pagination from '../components/ui/Pagination.jsx';

import { useProducts } from '../hooks/useProducts.js';
import { useSearch } from '../hooks/useSearch.js';
import { usePagination } from '../hooks/usePagination.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

// Predefined categories
const PRODUCT_CATEGORIES = [
  'Bracelets',
  'Necklaces',
  'Earrings',
  'Watches',
  'Others'
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({ category: 'all', minPrice: null, maxPrice: null, in_stock: false });
  const [sortBy, setSortBy] = useState('date-desc');

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const { products, categories, loading, error, refresh } = useProducts();
  const { searchTerm, setSearchTerm, filterProducts } = useSearch();

  // URL param category
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat.toLowerCase());
  }, []);

  // derive price range quickly from products
  const computedPriceRange = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [0, 0];
    const numbers = products.map(p => {
      if (typeof p.price === 'number') return p.price;
      const parsed = parseFloat(String(p.price).replace(/[^0-9.-]+/g, '')) || 0;
      return parsed;
    });
    return [Math.floor(Math.min(...numbers)), Math.ceil(Math.max(...numbers))];
  }, [products]);

  // apply search + filters + category + sorting
  const processedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let out = [...products];

    // 1) search term via helper or fallback to local filter
    if (filterProducts) {
      out = filterProducts(out, searchTerm);
    } else if (searchTerm) {
      const term = searchTerm.toLowerCase();
      out = out.filter(p => 
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // 2) selectedCategory (URL param)
    if (selectedCategory) {
      const normalizedSelected = selectedCategory.toLowerCase();
      out = out.filter(p => {
        const productCategory = (p.category || '').toLowerCase();
        if (normalizedSelected === 'others') {
          return !PRODUCT_CATEGORIES.slice(0, -1).map(c => c.toLowerCase()).includes(productCategory);
        }
        return productCategory === normalizedSelected;
      });
    }

    // 3) local filters (from FilterPanel)
    if (localFilters && localFilters.category && localFilters.category !== 'all') {
      const normalizedCategory = localFilters.category.toLowerCase();
      out = out.filter(p => {
        const productCategory = (p.category || '').toLowerCase();
        if (normalizedCategory === 'others') {
          return !PRODUCT_CATEGORIES.slice(0, -1).map(c => c.toLowerCase()).includes(productCategory);
        }
        return productCategory === normalizedCategory;
      });
    }

    if (localFilters.minPrice != null || localFilters.maxPrice != null) {
      const min = localFilters.minPrice != null ? Number(localFilters.minPrice) : -Infinity;
      const max = localFilters.maxPrice != null ? Number(localFilters.maxPrice) : Infinity;
      out = out.filter(p => {
        const price = parseFloat(String(p.price).replace(/[^0-9.-]+/g, '')) || 0;
        return price >= min && price <= max;
      });
    }

    if (localFilters.in_stock) {
      out = out.filter(p => !!p.in_stock);
    }

    // 4) sorting
    switch (sortBy) {
      case 'price-asc':
        out.sort((a, b) => (parseFloat(String(a.price).replace(/[^0-9.-]+/g, '')) || 0) - (parseFloat(String(b.price).replace(/[^0-9.-]+/g, '')) || 0));
        break;
      case 'price-desc':
        out.sort((a, b) => (parseFloat(String(b.price).replace(/[^0-9.-]+/g, '')) || 0) - (parseFloat(String(a.price).replace(/[^0-9.-]+/g, '')) || 0));
        break;
      case 'name-asc':
        out.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'name-desc':
        out.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'date-asc':
        out.sort((a, b) => new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0));
        break;
      case 'date-desc':
      default:
        out.sort((a, b) => new Date(b.dateAdded || b.date_added || 0) - new Date(a.dateAdded || a.date_added || 0));
        break;
    }

    return out;
  }, [products, searchTerm, filterProducts, selectedCategory, localFilters, sortBy]);

  // pagination
  const itemsPerPage = 12;
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    currentItems
  } = usePagination(processedProducts, itemsPerPage);

  // reset page when filters or search change
  useEffect(() => setCurrentPage(1), [searchTerm, localFilters, sortBy, selectedCategory, setCurrentPage]);

  const handleFilterChange = (changes) => {
    setLocalFilters(prev => ({ ...prev, ...changes }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocalFilters({ category: 'all', minPrice: null, maxPrice: null, in_stock: false });
    setSortBy('date-desc');
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message || 'Failed to load products.'}</p>
        <div className="flex gap-4">
          <button onClick={() => refresh()} className="px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
          <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded">Reload page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-playfair text-gray-800 mb-4">Our Collection</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover exquisite jewelry pieces crafted with precision and passion.</p>
            <div className="w-24 h-1 bg-gold-primary mx-auto mt-6"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-6">
              <button onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-center gap-2 bg-white border px-4 py-3 rounded-lg">
                <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
              <FilterPanel
                categories={PRODUCT_CATEGORIES}
                filters={localFilters}
                onFilterChange={handleFilterChange}
                priceRange={computedPriceRange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Main */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search jewelry..." />
                </div>

                <div className="flex items-center gap-4">
                  <SortOptions value={sortBy} onChange={handleSortChange} />
                  <div className="flex border rounded overflow-hidden">
                    <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-gold-primary text-white' : 'bg-white'}`}><Grid size={18} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-gold-primary text-white' : 'bg-white'}`}><List size={18} /></button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>Showing {processedProducts.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, processedProducts.length)} of {processedProducts.length} products</span>
                {(searchTerm || (localFilters && Object.keys(localFilters).some(k => localFilters[k] && localFilters[k] !== 'all'))) && (
                  <button onClick={clearFilters} className="text-gold-primary font-medium">Clear all filters</button>
                )}
              </div>
            </div>

            {/* No results */}
            {!loading && processedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search terms or filters to find what you're looking for.</p>
                <button onClick={clearFilters} className="bg-gold-primary text-white px-6 py-3 rounded-lg">Clear Filters</button>
              </div>
            )}

            {/* Grid/List */}
            {processedProducts.length > 0 && (
              <>
                <ProductGrid products={currentItems} viewMode={viewMode} className="mb-8" />

                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showPageNumbers={5} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 bg-gold-primary text-white p-3 rounded-full shadow-lg">
        <SortAsc size={20} className="transform rotate-180" />
      </button>
    </div>
  );
};

export default Products;
