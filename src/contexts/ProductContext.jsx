import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Import utility functions (you'll need to create these)
import { fetchProductsFromGitHub, updateProductsOnGitHub } from '../utils/github-api.js';

/**
 * Product Context for Donna's Jewelry Store
 * 
 * Manages global product state including:
 * - Product data from GitHub repository
 * - Loading and error states
 * - CRUD operations for admin
 * - Categories and filtering data
 * - Caching for performance
 */

// Initial state
const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  lastUpdated: null,
  cache: {
    products: null,
    timestamp: null,
    ttl: 5 * 60 * 1000 // 5 minutes cache
  }
};

// Action types
const ActionTypes = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_CATEGORIES: 'SET_CATEGORIES',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
const productReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionTypes.FETCH_SUCCESS:
      const { products, categories } = action.payload;
      return {
        ...state,
        products: products || [],
        categories: categories || [],
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
        cache: {
          products: products || [],
          timestamp: Date.now(),
          ttl: state.cache.ttl
        }
      };

    case ActionTypes.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionTypes.ADD_PRODUCT:
      const newProduct = action.payload;
      const updatedProducts = [...state.products, newProduct];
      return {
        ...state,
        products: updatedProducts,
        lastUpdated: new Date().toISOString(),
        cache: {
          ...state.cache,
          products: updatedProducts,
          timestamp: Date.now()
        }
      };

    case ActionTypes.UPDATE_PRODUCT:
      const { id, updates } = action.payload;
      const productIndex = state.products.findIndex(p => p.id === id);
      if (productIndex === -1) return state;

      const updatedProductList = [...state.products];
      updatedProductList[productIndex] = { 
        ...updatedProductList[productIndex], 
        ...updates,
        lastModified: new Date().toISOString()
      };

      return {
        ...state,
        products: updatedProductList,
        lastUpdated: new Date().toISOString(),
        cache: {
          ...state.cache,
          products: updatedProductList,
          timestamp: Date.now()
        }
      };

    case ActionTypes.DELETE_PRODUCT:
      const productId = action.payload;
      const filteredProducts = state.products.filter(p => p.id !== productId);
      return {
        ...state,
        products: filteredProducts,
        lastUpdated: new Date().toISOString(),
        cache: {
          ...state.cache,
          products: filteredProducts,
          timestamp: Date.now()
        }
      };

    case ActionTypes.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
export const ProductContext = createContext();

// Custom hook to use product context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

/**
 * ProductProvider Component
 * Wraps the app and provides product state management
 */
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    const { cache } = state;
    return cache.products && 
           cache.timestamp && 
           (Date.now() - cache.timestamp) < cache.ttl;
  }, [state.cache]);

  // Fetch products from GitHub or cache
  const fetchProducts = useCallback(async (forceRefresh = false) => {
    // Use cache if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      console.log('Using cached product data');
      return;
    }

    dispatch({ type: ActionTypes.FETCH_START });

    try {
      // Fetch from GitHub API
      const data = await fetchProductsFromGitHub();
      
      // Extract unique categories from products
      const categories = [...new Set(
        data.products?.map(product => product.category?.toLowerCase()).filter(Boolean)
      )].sort();

      dispatch({ 
        type: ActionTypes.FETCH_SUCCESS, 
        payload: { 
          products: data.products || [], 
          categories 
        } 
      });

    } catch (error) {
      console.error('Failed to fetch products:', error);
      dispatch({ 
        type: ActionTypes.FETCH_ERROR, 
        payload: error.message || 'Failed to load products'
      });
    }
  }, [isCacheValid]);

  // Add new product
  const addProduct = useCallback(async (productData) => {
    try {
      // Generate unique ID
      const newProduct = {
        ...productData,
        id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dateAdded: new Date().toISOString(),
        inStock: productData.inStock ?? true,
        featured: productData.featured ?? false
      };

      // Update local state immediately (optimistic update)
      dispatch({ type: ActionTypes.ADD_PRODUCT, payload: newProduct });

      // Update GitHub repository
      const updatedProducts = [...state.products, newProduct];
      await updateProductsOnGitHub(updatedProducts);

      return newProduct;

    } catch (error) {
      console.error('Failed to add product:', error);
      // Revert optimistic update on error
      await fetchProducts(true);
      throw new Error('Failed to add product: ' + error.message);
    }
  }, [state.products, fetchProducts]);

  // Update existing product
  const updateProduct = useCallback(async (productId, updates) => {
    try {
      const updatedData = {
        ...updates,
        lastModified: new Date().toISOString()
      };

      // Update local state immediately (optimistic update)
      dispatch({ 
        type: ActionTypes.UPDATE_PRODUCT, 
        payload: { id: productId, updates: updatedData } 
      });

      // Update GitHub repository
      const productIndex = state.products.findIndex(p => p.id === productId);
      if (productIndex === -1) throw new Error('Product not found');

      const updatedProducts = [...state.products];
      updatedProducts[productIndex] = { 
        ...updatedProducts[productIndex], 
        ...updatedData 
      };
      
      await updateProductsOnGitHub(updatedProducts);

      return updatedProducts[productIndex];

    } catch (error) {
      console.error('Failed to update product:', error);
      // Revert optimistic update on error
      await fetchProducts(true);
      throw new Error('Failed to update product: ' + error.message);
    }
  }, [state.products, fetchProducts]);

  // Delete product
  const deleteProduct = useCallback(async (productId) => {
    try {
      // Update local state immediately (optimistic update)
      dispatch({ type: ActionTypes.DELETE_PRODUCT, payload: productId });

      // Update GitHub repository
      const updatedProducts = state.products.filter(p => p.id !== productId);
      await updateProductsOnGitHub(updatedProducts);

      return true;

    } catch (error) {
      console.error('Failed to delete product:', error);
      // Revert optimistic update on error
      await fetchProducts(true);
      throw new Error('Failed to delete product: ' + error.message);
    }
  }, [state.products, fetchProducts]);

  // Get product by ID
  const getProductById = useCallback((productId) => {
    return state.products.find(product => product.id === productId) || null;
  }, [state.products]);

  // Get products by category
  const getProductsByCategory = useCallback((category) => {
    if (!category || category === 'all') return state.products;
    return state.products.filter(product => 
      product.category?.toLowerCase() === category.toLowerCase()
    );
  }, [state.products]);

  // Get featured products
  const getFeaturedProducts = useCallback((limit = 6) => {
    return state.products
      .filter(product => product.featured === true)
      .slice(0, limit);
  }, [state.products]);

  // Search products
  const searchProducts = useCallback((searchTerm) => {
    if (!searchTerm) return state.products;
    
    const searchLower = searchTerm.toLowerCase();
    return state.products.filter(product =>
      product.title?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [state.products]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  // Initial data fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-refresh data every 10 minutes if page is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && state.products.length > 0) {
        fetchProducts(true);
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchProducts, state.products.length]);

  // Context value
  const contextValue = {
    // State
    products: state.products,
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,

    // Actions
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    clearError,

    // Getters
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,

    // Cache info
    isCacheValid: isCacheValid(),
    cacheTimestamp: state.cache.timestamp
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
