import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

const categories = ['Electronics', 'Clothing', 'Furniture', 'Books', 'Sports', 'Home & Garden', 'Other'];

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price.toString(),
    image: product.image,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateProduct } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateProduct(product.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image || 'https://images.pexels.com/photos/4226914/pexels-photo-4226914.jpeg',
      });

      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="edit-category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="edit-description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              id="edit-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              id="edit-image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {formData.image && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              <img
                src={formData.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/4226914/pexels-photo-4226914.jpeg';
                }}
              />
            </div>
          )}

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;