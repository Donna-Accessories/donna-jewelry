import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';

const ProductTable = ({ onEdit }) => {
  const { products = [], loading, error, deleteProduct } = useProducts();
  const [deleteModal, setDeleteModal] = useState({ show: false, productId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      await deleteProduct(id);
      setDeleteModal({ show: false, productId: null });
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleteLoading(false);
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
                <button
                  onClick={() => onEdit(product)}
                  className="btn-secondary mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ show: true, productId: product.id })}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, productId: null })}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setDeleteModal({ show: false, productId: null })}
              className="btn-secondary"
              disabled={deleteLoading}
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteModal.productId)}
              className="btn-primary bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductTable;
