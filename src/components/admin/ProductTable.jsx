import React, { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductTable = ({ onEdit }) => {
  const { products = [], loading, error, deleteProduct } = useProducts();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (productId) => {
    if (deleteConfirm === productId) {
      try {
        setDeleteError(null);
        await deleteProduct(productId);
      } catch (err) {
        console.error('Failed to delete product:', err);
        setDeleteError(err.message);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(productId);
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full mx-auto overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gold-primary">Product List</h2>
        <span className="text-gray-600">{products.length} products</span>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </td>
              <td className="border px-4 py-2">{product.title}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">{product.category}</td>
              <td className="border px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="border px-4 py-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Edit product"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  
                  {deleteConfirm === product.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Confirm delete"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                        title="Cancel delete"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete product"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {deleteError && product.id === deleteConfirm && (
                  <p className="text-sm text-red-600 mt-1">{deleteError}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ProductTable;
