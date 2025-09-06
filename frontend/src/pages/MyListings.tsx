import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Layout from '../components/Layout';
import EditProductModal from '../components/EditProductModal';

const MyListings: React.FC = () => {
  const { user } = useAuth();
  const { products, deleteProduct } = useApp();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const myProducts = products.filter(product => product.sellerId === user?.id);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600">Manage your product listings</p>
          </div>
          <Link
            to="/add-product"
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Products Grid */}
        {myProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No listings yet</h3>
              <p>Start selling by adding your first product</p>
            </div>
            <Link
              to="/add-product"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mt-4"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showActions={true}
                onEdit={() => handleEdit(product)}
                onDelete={() => handleDelete(product.id)}
                onClick={() => window.location.href = `/product/${product.id}`}
              />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default MyListings;