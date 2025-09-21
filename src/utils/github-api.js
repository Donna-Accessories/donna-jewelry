// src/utils/github-api.js
// Local file system helpers for development
// Fetches from local files during development

const LOCAL_PRODUCTS_URL = "/src/data/products.json";

export async function fetchProductsFromGitHub() {
  try {
    const res = await fetch(LOCAL_PRODUCTS_URL);
    if (!res.ok) {
      throw new Error(`Local fetch failed: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching products locally:", err);
    return { products: [] }; // always return an object with products array
  }
}

// Alternative function name that's more descriptive for local development
export async function fetchProductsLocally() {
  return fetchProductsFromGitHub(); // Reuse the same logic
}

// Simple fetch example for reference
export function fetchProductsExample() {
  return fetch('/src/data/products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Products loaded:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      return { products: [] };
    });
}

/**
 * Update products via local API endpoint
 * This assumes you have a local development server with an API endpoint
 */
export async function updateProductsOnGitHub(
  products,
  token,
  repo = "local-development", // placeholder for compatibility
  branch = "main" // placeholder for compatibility
) {
  try {
    const response = await fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });

    if (!response.ok) {
      throw new Error(`Local API update failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Products updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating products locally:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Alternative: Save to localStorage for temporary persistence during development
 * This won't persist across server restarts but useful for testing
 */
export async function saveProductsToLocalStorage(products) {
  try {
    localStorage.setItem('donna-jewelry-products', JSON.stringify(products));
    console.log('Products saved to localStorage');
    return { success: true, message: "Saved to localStorage" };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load products from localStorage (fallback for development)
 */
export async function loadProductsFromLocalStorage() {
  try {
    const stored = localStorage.getItem('donna-jewelry-products');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Hybrid fetch: Try local API first, fallback to static file, then localStorage
 */
export async function fetchProductsHybrid() {
  try {
    // Try local API endpoint first
    const apiResponse = await fetch('/api/products');
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log('Loaded products from API');
      return data;
    }
  } catch (apiError) {
    console.log('API not available, trying static file...');
  }

  try {
    // Fallback to static file
    const fileResponse = await fetch(LOCAL_PRODUCTS_URL);
    if (fileResponse.ok) {
      const data = await fileResponse.json();
      console.log('Loaded products from static file');
      return data;
    }
  } catch (fileError) {
    console.log('Static file not available, trying localStorage...');
  }

  // Final fallback to localStorage
  const localData = loadProductsFromLocalStorage();
  if (localData) {
    console.log('Loaded products from localStorage');
    return localData;
  }

  console.warn('No product data found anywhere, returning empty array');
  return { products: [] };
}

/**
 * Utility function to validate product data structure
 */

export async function validateProductData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  if (!Array.isArray(data.products)) {
    return false;
  }
  
  return true;
}