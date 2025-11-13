import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react"; // icons
import LoadingSpinner from "../ui/LoadingSpinner";

const ProductTable = ({ products, onEdit, onDelete, loading }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteClick = (productId) => {
    setConfirmDelete(productId);
  };

  const confirmDeletion = () => {
    if (confirmDelete) {
      onDelete(confirmDelete);
      setConfirmDelete(null);
    }
  };

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto overflow-x-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gold-primary">Product List</h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <table className="min-w-[640px] w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="border px-4 py-2">{product.title}</td>
                  <td className="border px-4 py-2">${product.price}</td>
                  <td className="border px-4 py-2">{product.category}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800 mx-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="text-red-600 hover:text-red-800 mx-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletion}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
