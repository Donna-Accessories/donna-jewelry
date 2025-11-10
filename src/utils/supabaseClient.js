import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Supabase Key starts with:', supabaseAnonKey?.slice(0, 10));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchProductsFromSupabase = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
  return data;
};

export const updateProductsInSupabase = async (products) => {
  const { error } = await supabase.from('products').upsert(products);
  if (error) {
    console.error('Error updating products:', error);
    throw new Error('Failed to update products');
  }
};

export default supabase;

