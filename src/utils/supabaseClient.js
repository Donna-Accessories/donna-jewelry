import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchProductsFromSupabase = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
  return data;
};

export const addProductToSupabase = async (product) => {
  const { data, error } = await supabase.from('products').insert(product).select();
  if (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
  return data[0];
};

export const updateProductInSupabase = async (id, updates) => {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
  if (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
  return data[0];
};

export const deleteProductFromSupabase = async (id) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};



export default supabase;

