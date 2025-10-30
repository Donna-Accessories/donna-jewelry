// src/data/types.js

/**
 * @typedef {Object} Product
 * @property {string} id - Unique identifier
 * @property {string} title - Product title
 * @property {number} price - Product price
 * @property {string} description - Product description
 * @property {string} category - Product category
 * @property {string} image - Image URL
 * @property {boolean} inStock - Stock status
 * @property {boolean} featured - Featured status
 * @property {string[]} tags - Product tags
 */

/**
 * Validates a product object
 * @param {Product} product - Product to validate
 * @returns {boolean} - Whether the product is valid
 */
export const validateProduct = (product) => {
  if (!product) return false;
  
  const requiredFields = ['id', 'title', 'price', 'category'];
  for (const field of requiredFields) {
    if (!product[field]) return false;
  }

  if (typeof product.price !== 'number') return false;
  if (typeof product.inStock !== 'boolean') return false;
  if (typeof product.featured !== 'boolean') return false;
  
  return true;
};

/**
 * Formats raw product data from Supabase
 * @param {Object} rawProduct - Raw product data
 * @returns {Product} - Formatted product
 */
export const formatProduct = (rawProduct) => {
  return {
    id: rawProduct.id,
    title: rawProduct.title,
    price: parseFloat(rawProduct.price),
    description: rawProduct.description || '',
    category: rawProduct.category,
    image: rawProduct.image || '',
    inStock: Boolean(rawProduct.in_stock),
    featured: Boolean(rawProduct.featured),
    tags: Array.isArray(rawProduct.tags) ? rawProduct.tags : []
  };
};