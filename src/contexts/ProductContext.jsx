// src/contexts/ProductContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import supabase from "../utils/supabaseClient"; // ✅ default export
import { useAdminContext } from "./AdminContext";
import { debugLog, logError } from "../utils/debug";
import { formatProduct } from "../data/types";

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
    ttl: 5 * 60 * 1000, // 5 minutes
  },
};

// Action types
const ActionTypes = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  SET_CATEGORIES: "SET_CATEGORIES",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",
};

// Reducer
function productReducer(state, action) {
  switch (action.type) {
    case ActionTypes.FETCH_START:
      return { ...state, loading: true, error: null };
    case ActionTypes.FETCH_SUCCESS: {
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
          ttl: state.cache.ttl,
        },
      };
    }
    case ActionTypes.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ActionTypes.ADD_PRODUCT: {
      const updatedProducts = [...state.products, action.payload];
      return {
        ...state,
        products: updatedProducts,
        lastUpdated: new Date().toISOString(),
        cache: {
          ...state.cache,
          products: updatedProducts,
          timestamp: Date.now(),
        },
      };
    }
    case ActionTypes.UPDATE_PRODUCT: {
      const { id, updates } = action.payload;
      const updatedProducts = state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      return {
        ...state,
        products: updatedProducts,
        lastUpdated: new Date().toISOString(),
        cache: {
          ...state.cache,
          products: updatedProducts,
          timestamp: Date.now(),
        },
      };
    }
    case ActionTypes.DELETE_PRODUCT: {
      const updatedProducts = state.products.filter(
        (p) => p.id !== action.payload
      );
      return {
        ...state,
        products: updatedProducts,
        lastUpdated: new Date().toISOString(),
        cache: {
          ...state.cache,
          products: updatedProducts,
          timestamp: Date.now(),
        },
      };
    }
    case ActionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case ActionTypes.RESET_STATE:
      return initialState;
    default:
      return state;
  }
}

// Create context
export const ProductContext = createContext(null);

// Hook
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProductContext must be used within ProductProvider");
  return context;
};

// Provider
const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // ✅ Safe fallback: don’t crash if AdminProvider isn’t mounted yet
  let isAuthenticated = false;
  try {
    const admin = useAdminContext();
    isAuthenticated = admin?.isAuthenticated || false;
  } catch {
    isAuthenticated = false;
  }

  const isCacheValid = useCallback(() => {
    const { cache } = state;
    return (
      cache.products &&
      cache.timestamp &&
      Date.now() - cache.timestamp < cache.ttl
    );
  }, [state.cache]);

  // --- Fetch products & categories ---
  const fetchProducts = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh && isCacheValid()) return;

      dispatch({ type: ActionTypes.FETCH_START });
      try {
        // Log current auth session to help diagnose RLS / auth issues
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          debugLog('ProductContext', 'currentSession', sessionData?.session || null);
        } catch (sessionErr) {
          debugLog('ProductContext', 'sessionCheckError', { message: sessionErr?.message || String(sessionErr) });
        }

        const { data: productsRaw, error: productsError, status, statusText } =
          await supabase
            .from("products")
            .select("*")
            .order("date_added", { ascending: false });

        debugLog("ProductContext", "fetchProducts response", {
          status,
          statusText,
          productsError,
          productsCount: productsRaw?.length || 0,
        });

        if (productsError) {
          // Detect RLS-related errors and throw a clearer message
          const msg = productsError.message || String(productsError);
          if (msg.toLowerCase().includes("row-level")) {
            throw new Error(
              "Row-level security prevented fetching products. Check Supabase table policies."
            );
          }
          throw productsError;
        }

        const { data: categoryData, error: categoriesError } = await supabase
          .from("categories")
          .select("name");

        if (categoriesError) throw categoriesError;

        // Normalize products using formatProduct helper
        const products = (productsRaw || []).map((p) => formatProduct(p));

        const categories = categoryData
          ? categoryData.map((c) => c.name.toLowerCase()).sort()
          : [
              ...new Set(
                products
                  ?.map((p) => p.category?.toLowerCase())
                  .filter(Boolean)
              ),
            ].sort();

        dispatch({
          type: ActionTypes.FETCH_SUCCESS,
          payload: { products: products || [], categories },
        });
      } catch (err) {
        logError("ProductContext.fetchProducts", err, { isAuthenticated });
        dispatch({
          type: ActionTypes.FETCH_ERROR,
          payload:
            err.message || "Failed to load products (check Supabase connection / policies)",
        });
      }
    },
    [isCacheValid]
  );

  // --- Add product ---
  const addProduct = useCallback(
    async (productData) => {
      if (!isAuthenticated) {
        dispatch({ type: ActionTypes.FETCH_ERROR, payload: "Not authorized" });
        return null;
      }

      try {
        // Log current auth session before attempting to insert
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          debugLog('ProductContext', 'currentSessionBeforeInsert', sessionData?.session || null);
        } catch (_) {}
        dispatch({ type: ActionTypes.FETCH_START });
        const newProduct = {
          ...productData,
          in_stock: productData.in_stock ?? true,
          featured: productData.featured ?? false,
          date_added: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("products")
          .insert([newProduct])
          .select()
          .single();

        if (error) throw error;

        dispatch({ type: ActionTypes.ADD_PRODUCT, payload: data });
        return data;
      } catch (err) {
        logError("ProductContext.addProduct", err, { productData });
        // Detect RLS insertion errors
        const message = err?.message || String(err);
        if (message.toLowerCase().includes("row-level")) {
          dispatch({
            type: ActionTypes.FETCH_ERROR,
            payload:
              "Insert blocked by Row Level Security. Make sure authenticated user or policies are configured.",
          });
        } else {
          dispatch({ type: ActionTypes.FETCH_ERROR, payload: message });
        }
        return null;
      }
    },
    [isAuthenticated]
  );

  // --- Update product ---
  const updateProduct = useCallback(
    async (id, updates) => {
      if (!isAuthenticated) {
        dispatch({ type: ActionTypes.FETCH_ERROR, payload: "Not authorized" });
        return null;
      }

      try {
        // Log current auth session before attempting to update
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          debugLog('ProductContext', 'currentSessionBeforeUpdate', sessionData?.session || null);
        } catch (_) {}
        dispatch({ type: ActionTypes.FETCH_START });

        const { data, error } = await supabase
          .from("products")
          .update({ ...updates, last_modified: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        dispatch({
          type: ActionTypes.UPDATE_PRODUCT,
          payload: { id, updates: data },
        });
        return data;
      } catch (err) {
        logError("ProductContext.updateProduct", err, { id, updates });
        const message = err?.message || String(err);
        if (message.toLowerCase().includes("row-level")) {
          dispatch({
            type: ActionTypes.FETCH_ERROR,
            payload:
              "Update blocked by Row Level Security. Ensure your Supabase policies allow this operation.",
          });
        } else {
          dispatch({ type: ActionTypes.FETCH_ERROR, payload: message });
        }
        return null;
      }
    },
    [isAuthenticated]
  );

  // --- Delete product ---
  const deleteProduct = useCallback(
    async (id) => {
      if (!isAuthenticated) {
        dispatch({ type: ActionTypes.FETCH_ERROR, payload: "Not authorized" });
        return false;
      }

      try {
        // Log current auth session before attempting to delete
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          debugLog('ProductContext', 'currentSessionBeforeDelete', sessionData?.session || null);
        } catch (_) {}
        dispatch({ type: ActionTypes.FETCH_START });

        const { error } = await supabase.from("products").delete().eq("id", id);

        if (error) throw error;

        dispatch({ type: ActionTypes.DELETE_PRODUCT, payload: id });
        return true;
      } catch (err) {
        logError("ProductContext.deleteProduct", err, { id });
        const message = err?.message || String(err);
        if (message.toLowerCase().includes("row-level")) {
          dispatch({
            type: ActionTypes.FETCH_ERROR,
            payload:
              "Delete blocked by Row Level Security. Ensure your Supabase policies allow deletes for admins.",
          });
        } else {
          dispatch({ type: ActionTypes.FETCH_ERROR, payload: message });
        }
        return false;
      }
    },
    [isAuthenticated]
  );

  // Auto-fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Refresh every 10 minutes if tab is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && state.products.length > 0) fetchProducts(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchProducts, state.products.length]);

  const contextValue = {
    ...state,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById: (id) => state.products.find((p) => p.id === id) || null,
    getProductsByCategory: (cat) =>
      !cat || cat === "all"
        ? state.products
        : state.products.filter(
            (p) => p.category?.toLowerCase() === cat.toLowerCase()
          ),
    getFeaturedProducts: (limit = 6) =>
      state.products.filter((p) => p.featured).slice(0, limit),
    searchProducts: (term) => {
      if (!term) return state.products;
      const t = term.toLowerCase();
      return state.products.filter(
        (p) =>
          p.title?.toLowerCase().includes(t) ||
          p.description?.toLowerCase().includes(t) ||
          p.category?.toLowerCase().includes(t) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(t))
      );
    },
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    isCacheValid: isCacheValid(),
    cacheTimestamp: state.cache.timestamp,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

// Export both named and default
export { ProductProvider };
export default ProductProvider;
