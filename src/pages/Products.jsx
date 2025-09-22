import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react';

// Components
import ProductGrid from '../components/product/ProductGrid.jsx';
import SearchBar from '../components/search/SearchBar.jsx';
import FilterPanel from '../components/search/FilterPanel.jsx';
import SortOptions from '../components/search/SortOptions.jsx';
import Pagination from '../components/ui/Pagination.jsx';

// Hooks
import { useProducts } from '../hooks/useProducts.js';
import { useSearch } from '../hooks/useSearch.js';
import { usePagination } from '../hooks/usePagination.js';

/**
 * Products Page Component - Complete Jewelry Catalog
 * 
 * Features:
 * - Comprehensive product catalog with grid view
 * - Advanced search and filtering
 * - Category-based filtering (rings, necklaces, earrings, etc.)
 * - Price range filtering
 * - Sorting options (price, name, date added)
 * - Pagination for performance
 * - Mobile-optimized jewelry browsing
 * - WhatsApp integration for inquiries
 */
const Products = () => {
  // State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState({ field: 'dateAdded', direction: 'desc' });
  const [viewMode, setViewMode] = useState('grid');
  
  // Hooks
  const { products, loading, error, categories } = useProducts();
  const { searchTerm, handleSearch, results: searchResults } = useSearch();
  
  // Handle URL parameters for category filtering
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    }
  }, []);

  // Handle loading and error states
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
        <h2 className="text-2xl font-bold text-red-600 mb-2">Something Went Wrong</h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'An error occurred while loading products. Please try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Apply all filters in sequence
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 1. Apply search filter first
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      );
    }

    // 2. Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory
      );
    }

    // 3. Apply sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortOrder.field];
      const bValue = b[sortOrder.field];
      const direction = sortOrder.direction === 'asc' ? 1 : -1;

      if (sortOrder.field === 'price') {
        // Handle price sorting (remove currency symbol and convert to number)
        const aPrice = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
        const bPrice = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
        return (aPrice - bPrice) * direction;
      }

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });
  }, [products, searchTerm, searchResults, selectedCategory, sortOrder]);

  // Handle search changes
  useEffect(() => {
    handleSearch(searchTerm, products);
  }, [searchTerm, products, handleSearch]);

  // Dummy data for placeholder display
  const dummyProducts = [
    {
      id: 'dummy1',
      title: 'Gold Plated Necklace',
      description: 'Elegant gold plated necklace with Ghanaian beads.',
      price: '$49',
      category: 'necklaces',
      inStock: true,
      featured: true,
      image: '/public/vite.svg',
      dateAdded: '2025-09-01',
      tags: ['gold', 'necklace', 'ghana']
    },
    {
      id: 'dummy2',
      title: 'Classic Hoop Earrings',
      description: 'Timeless hoop earrings for every occasion.',
      price: '$29',
      category: 'earrings',
      inStock: true,
      featured: false,
      image: '/src/assets/react.svg',
      dateAdded: '2025-09-02',
      tags: ['earrings', 'classic']
    },
    {
      id: 'dummy3',
      title: 'Beaded Bracelet',
      description: 'Handcrafted bracelet with colorful beads.',
      price: '$19',
      category: 'bracelets',
      inStock: false,
      featured: false,
      image: '/src/assets/react.svg',
      dateAdded: '2025-09-03',
      tags: ['bracelet', 'beads']
    }
  ];

  // Use dummy data if no products loaded and not loading/error
  if (!loading && !error && (!products || products.length === 0)) {
    products = dummyProducts;
    categories = [...new Set(dummyProducts.map(p => p.category))];
  }
  const {
    filters = {},
    setFilters = () => {},
    sortBy = '',
    setSortBy = () => {},
  } = useSearch() || {};
  
  // Local state for UI controls
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Items per page configuration
  const itemsPerPage = 12;

  // Apply filters in sequence (sorting will be handled separately)
  const processedProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    let filtered = [...products];

    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters && filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply price range filter
    if (filters && (filters.minPrice || filters.maxPrice)) {
      filtered = filtered.filter(product => {
        // Extract numeric price from string (e.g., "$1,299" -> 1299)
        const price = parseFloat(product.price?.replace(/[$,]/g, '') || '0');
        const min = filters.minPrice || 0;
        const max = filters.maxPrice || 99999;
        return price >= min && price <= max;
      });
    }

    // Apply in-stock filter
    if (filters && filters.inStock) {
      filtered = filtered.filter(product => product.inStock === true);
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return parseFloat(a.price?.replace(/[$,]/g, '') || '0') - 
                   parseFloat(b.price?.replace(/[$,]/g, '') || '0');
          case 'price-desc':
            return parseFloat(b.price?.replace(/[$,]/g, '') || '0') - 
                   parseFloat(a.price?.replace(/[$,]/g, '') || '0');
          case 'name-asc':
            return a.title?.localeCompare(b.title || '') || 0;
          case 'name-desc':
            return b.title?.localeCompare(a.title || '') || 0;
          case 'date-desc':
            return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
          case 'date-asc':
            return new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, searchTerm, filters, sortBy]);

  // Pagination hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    currentItems
  } = usePagination(processedProducts, itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy, setCurrentPage]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSortBy('');
    setPriceRange([0, 10000]);
  };

  // Calculate price range from products
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const prices = products.map(p => parseFloat(p.price?.replace(/[$,]/g, '') || '0'));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([Math.floor(minPrice), Math.ceil(maxPrice)]);
    }
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-playfair text-gray-800 mb-4">
              Our Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover exquisite jewelry pieces crafted with precision and passion. 
              Each item tells a story of elegance and timeless beauty.
            </p>
            <div className="w-24 h-1 bg-gold-primary mx-auto mt-6"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-1/4">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-white border border-gray-300 
                  px-4 py-3 rounded-lg font-medium text-gray-700
                  hover:bg-gray-50 transition-colors duration-200
                "
              >
                <Filter size={20} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Filter Panel */}
            <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
              <FilterPanel
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                priceRange={priceRange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search and Controls Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search jewelry..."
                  />
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-4">
                  {/* Sort Options */}
                  <SortOptions
                    value={sortBy}
                    onChange={setSortBy}
                  />

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`
                        p-2 transition-colors duration-200
                        ${viewMode === 'grid' 
                          ? 'bg-gold-primary text-white' 
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                        }
                      `}
                      aria-label="Grid view"
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`
                        p-2 transition-colors duration-200
                        ${viewMode === 'list' 
                          ? 'bg-gold-primary text-white' 
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                        }
                      `}
                      aria-label="List view"
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {startIndex + 1}-{Math.min(endIndex, processedProducts.length)} of {processedProducts.length} products
                </span>
                
                {/* Active Filters */}
                {(searchTerm || Object.keys(filters).length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-gold-primary hover:text-gold-600 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-3 border-gold-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading jewelry collection...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700 mb-4">Unable to load products</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results State */}
            {!loading && !error && processedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gold-primary hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Clear Filters
                </button>
                {/* Dummy product placeholders */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {dummyProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                      <img src={product.image} alt={product.title} className="w-24 h-24 object-contain mb-4" />
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{product.title}</h4>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <div className="text-gold-primary font-semibold mb-2">{product.price}</div>
                      <span className={`px-3 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && !error && (
              <>
                {selectedCategory && (
                  <div className="mb-4 px-4">
                    <h2 className="text-2xl font-semibold capitalize">
                      {selectedCategory}
                    </h2>
                  </div>
                )}
                <ProductGrid
                  products={currentItems}
                  viewMode={viewMode}
                  className="mb-8"
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      showPageNumbers={5}
                    />
                  </div>
                )}
              </>
            )}

            {/* Quick Stats */}
            {!loading && !error && products?.length > 0 && (
              <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-gold-primary mb-2">
                      {products.length}
                    </div>
                    <div className="text-gray-600">Total Pieces</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold-primary mb-2">
                      {categories?.length || 0}
                    </div>
                    <div className="text-gray-600">Categories</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold-primary mb-2">
                      {products.filter(p => p.inStock).length}
                    </div>
                    <div className="text-gray-600">In Stock</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="
          fixed bottom-6 right-6 
          bg-gold-primary hover:bg-gold-600 
          text-white p-3 rounded-full shadow-lg
          transform hover:scale-110 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2
          z-40
        "
        aria-label="Back to top"
      >
        <SortAsc size={20} className="transform rotate-180" />
      </button>
    </div>
  );
};

export default Products;