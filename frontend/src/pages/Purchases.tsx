import React from 'react';
import { Calendar, Package } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout';

const Purchases: React.FC = () => {
  const { purchases } = useApp();

  const sortedPurchases = purchases.sort(
    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
          <p className="text-gray-600">View all your previous purchases</p>
        </div>

        {sortedPurchases.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your purchase history</p>
            <a
              href="/"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPurchases.map((purchase) => (
              <div key={purchase.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Order #{purchase.id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${purchase.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        {purchase.items.length} {purchase.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {purchase.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.product.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            by {item.product.sellerName}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                              {item.product.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${item.product.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Purchases;