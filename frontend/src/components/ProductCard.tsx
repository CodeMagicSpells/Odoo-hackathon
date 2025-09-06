import React from 'react';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onClick,
  showActions = false,
}) => {
  const { user } = useAuth();
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && product.sellerId !== user.id) {
      addToCart(product);
    }
  };

  const isOwnProduct = user?.id === product.sellerId;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
          <span className="text-lg font-bold text-green-600 ml-2">${product.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {product.category}
          </span>
          <span className="text-xs text-gray-500">by {product.sellerName}</span>
        </div>

        {showActions && isOwnProduct ? (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex-1 flex items-center justify-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          !isOwnProduct && (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ProductCard;