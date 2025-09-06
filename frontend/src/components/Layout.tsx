import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, ShoppingCart, Package, LogOut, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { cart } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/my-listings', icon: Package, label: 'My Listings' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cart.length },
    { path: '/dashboard', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EcoFinds</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map(({ path, icon: Icon, label, badge }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center px-2 py-2 relative ${
                isActive(path) ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {badge}
                </span>
              )}
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:fixed md:left-0 md:top-16 md:bottom-0 md:w-64 md:bg-white md:border-r md:border-gray-200 md:block">
        <div className="p-6">
          <ul className="space-y-4">
            {navigationItems.map(({ path, icon: Icon, label, badge }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
                    isActive(path)
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <style>
        {`
          @media (min-width: 768px) {
            .max-w-7xl {
              margin-left: 16rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Layout;