// src/hooks/useProducts.js
import { useProductContext } from "../contexts/ProductContext";

/**
 * useProducts - wrapper around ProductContext
 * Gives you: products, categories, loading, error,
 * and CRUD helpers (add, update, delete, refresh)
 */
export const useProducts = () => {
  const {
    products,
    categories,
    loading,
    error,
    fetchProducts: refresh,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductContext();

  return {
    products,
    categories,
    loading,
    error,
    refresh,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
