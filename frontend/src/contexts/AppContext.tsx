import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Purchase } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  purchases: Purchase[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  completePurchase: () => void;
  searchProducts: (query: string) => Product[];
  filterProductsByCategory: (category: string) => Product[];
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedProducts = localStorage.getItem('ecofinds-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with sample data
      const sampleProducts: Product[] = [
        {
          id: '1',
          title: 'Vintage Leather Jacket',
          description: 'Beautiful vintage leather jacket in excellent condition',
          category: 'Clothing',
          price: 89.99,
          image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg',
          sellerId: 'sample',
          sellerName: 'EcoFinds Team',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'MacBook Pro 13"',
          description: 'Used MacBook Pro in great working condition, perfect for students',
          category: 'Electronics',
          price: 899.99,
          image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg',
          sellerId: 'sample',
          sellerName: 'EcoFinds Team',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setProducts(sampleProducts);
      localStorage.setItem('ecofinds-products', JSON.stringify(sampleProducts));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`ecofinds-cart-${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedPurchases = localStorage.getItem(`ecofinds-purchases-${user.id}`);
      if (savedPurchases) {
        setPurchases(JSON.parse(savedPurchases));
      }
    } else {
      setCart([]);
      setPurchases([]);
    }
  }, [user]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('ecofinds-products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id 
        ? { ...product, ...productData, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('ecofinds-products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('ecofinds-products', JSON.stringify(updatedProducts));
  };

  const addToCart = (product: Product) => {
    if (!user) return;

    const existingItem = cart.find(item => item.product.id === product.id);
    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    localStorage.setItem(`ecofinds-cart-${user.id}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: string) => {
    if (!user) return;

    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem(`ecofinds-cart-${user.id}`, JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (!user) return;

    setCart([]);
    localStorage.removeItem(`ecofinds-cart-${user.id}`);
  };

  const completePurchase = () => {
    if (!user || cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      userId: user.id,
      items: cart,
      total,
      purchaseDate: new Date().toISOString(),
    };

    const updatedPurchases = [...purchases, newPurchase];
    setPurchases(updatedPurchases);
    localStorage.setItem(`ecofinds-purchases-${user.id}`, JSON.stringify(updatedPurchases));
    clearCart();
  };

  const searchProducts = (query: string): Product[] => {
    if (!query) return products;
    return products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterProductsByCategory = (category: string): Product[] => {
    if (!category || category === 'All') return products;
    return products.filter(product => product.category === category);
  };

  return (
    <AppContext.Provider value={{
      products,
      cart,
      purchases,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      clearCart,
      completePurchase,
      searchProducts,
      filterProductsByCategory,
    }}>
      {children}
    </AppContext.Provider>
  );
};