import { useCallback } from 'react';
import supabase from '../utils/supabaseClient';

export function useSupabase() {
  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('dateAdded', { ascending: false });

      if (error) throw error;
      return { products: data || [] };
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  }, []);

  const addProduct = useCallback(async (productData) => {
    try {
      const newProduct = {
        ...productData,
        dateAdded: new Date().toISOString(),
        inStock: productData.inStock ?? true,
        featured: productData.featured ?? false
      };

      // If there's an image to upload
      if (productData.imageFile) {
        const fileName = `${Date.now()}_${productData.imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, productData.imageFile);

        if (uploadError) throw uploadError;

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        newProduct.image = publicUrl;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error adding product:', err);
      return null;
    }
  }, []);

  const editProduct = useCallback(async (id, updates) => {
    try {
      // Handle image upload if there's a new image
      if (updates.imageFile) {
        const fileName = `${Date.now()}_${updates.imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, updates.imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        updates.image = publicUrl;
      }

      // Remove the imageFile from updates as it's not a database field
      const { imageFile, ...dbUpdates } = updates;

      const { data, error } = await supabase
        .from('products')
        .update({ ...dbUpdates, lastModified: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating product:', err);
      return null;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      // Get product to find image URL
      const { data: product } = await supabase
        .from('products')
        .select('image')
        .eq('id', id)
        .single();

      // Delete image from storage if it exists
      if (product?.image) {
        const fileName = product.image.split('/').pop();
        await supabase.storage
          .from('product-images')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching settings:', err);
      return null;
    }
  }, []);

  const updateSettings = useCallback(async (settings) => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .upsert(settings)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating settings:', err);
      return null;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching categories:', err);
      return [];
    }
  }, []);

  const uploadImage = useCallback(async (file) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  }, []);

  return {
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct,
    fetchSettings,
    updateSettings,
    fetchCategories,
    uploadImage
  };
}
