// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import supabase from '../utils/supabaseClient';

/**
 * useProducts - loads products and categories from Supabase
 * Exposes: products[], categories[], loading, error, refresh()
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // products table should include: id, title, description, price, category, image, tags, in_stock, featured, date_added (or dateAdded)
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('date_added', { ascending: false });

      if (fetchError) throw fetchError;

      const normalized = (data || []).map(p => ({
        id: p.id,
        title: p.title || 'Untitled',
        description: p.description || '',
        price: p.price ? (typeof p.price === 'number' ? p.price.toString() : p.price) : '0',
        // Some records may use date_added / dateAdded, normalize
        dateAdded: p.date_added || p.dateAdded || new Date().toISOString(),
        category: (p.category || 'uncategorized').toString(),
        image: p.image || '',
        tags: Array.isArray(p.tags) ? p.tags : (p.tags ? [String(p.tags)] : []),
        inStock: !!p.in_stock,
        featured: !!p.featured,
        raw: p
      }));

      setProducts(normalized);

      // derive categories from products (unique)
      const unique = Array.from(new Set(normalized.map(p => p.category?.toString().toLowerCase() || 'uncategorized')))
        .filter(Boolean)
        .sort();
      setCategories(unique);
    } catch (err) {
      console.error('useProducts fetch error', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add a new product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([{
          title: productData.title,
          description: productData.description,
          price: productData.price,
          category: productData.category.toLowerCase(),
          image: productData.image,
          tags: productData.tags,
          in_stock: productData.inStock,
          featured: productData.featured,
          date_added: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchProducts(); // Refresh the list
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('products')
        .update({
          title: productData.title,
          description: productData.description,
          price: productData.price,
          category: productData.category.toLowerCase(),
          image: productData.image,
          tags: productData.tags,
          in_stock: productData.inStock,
          featured: productData.featured,
          last_modified: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    categories,
    loading,
    error,
    refresh: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
