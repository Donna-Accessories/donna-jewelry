import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ImageUpload from './ImageUpload';

const PRODUCT_CATEGORIES = [
  'Bracelets',
  'Necklaces',
  'Earrings',
  'Watches',
  'Others'
];

const ProductForm = ({ product, onClose, onSave, setError: setParentError }) => {
  const { addProduct, updateProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: PRODUCT_CATEGORIES[0],
    in_stock: true,
    featured: false,
    image: '',
    tags: [],
    ...(product || {}) // Pre-fill if editing
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setParentError?.(null);

      if (!formData.title || !formData.price || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        tags: Array.isArray(formData.tags)
          ? formData.tags
          : formData.tags.split(',').map(t => t.trim()),
        date_added: formData.date_added || new Date().toISOString(),
        last_modified: new Date().toISOString()
      };
      
      if (product?.id) {
        await updateProduct(product.id, productData);
      } else {
        await addProduct(productData);
      }

      onSave?.();
    } catch (err) {
      const message = err.message || 'Failed to save product';
      setError(message);
      setParentError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-8 w-full max-w-2xl mx-auto">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-gold-primary text-center border-b border-gray-200 pb-3">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Image</h3>
          <ImageUpload
            currentImage={formData.image}
            onUpload={handleImageUpload}
            loading={loading}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition"
            required
          >
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
            onChange={handleChange}
            placeholder="gold, necklace, handmade"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-gold-primary border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-gold-primary border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Featured</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition disabled:opacity-60"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-600 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
