export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  purchaseDate: string;
}