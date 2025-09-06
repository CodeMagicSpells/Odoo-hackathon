import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, User, Calendar, Tag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const { user } = useAuth();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </Layout>
    );
  }

  const isOwnProduct = user?.id === product.sellerId;

  const handleAddToCart = () => {
    if (!isOwnProduct) {
      addToCart(product);
      alert('Product added to cart!');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-3xl font-bold text-green-600">
                  ${product.price}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center space-x-1">
                  <Tag className="w-4 h-4" />
                  <span>{product.category}</span>
                </span>
                <span className="text-sm text-gray-500 flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Listed {new Date(product.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.sellerName}</p>
                    <p className="text-sm text-gray-600">Verified Seller</p>
                  </div>
                </div>
              </div>

              {!isOwnProduct && (
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center space-x-3 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Free shipping on all orders
                  </p>
                </div>
              )}

              {isOwnProduct && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm font-medium">
                      This is your listing. You cannot purchase your own items.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;