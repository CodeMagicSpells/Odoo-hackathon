import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecofinds-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('ecofinds-users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('ecofinds-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    const users = JSON.parse(localStorage.getItem('ecofinds-users') || '[]');
    const existingUser = users.find((u: User) => u.email === userData.email);
    
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('ecofinds-users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('ecofinds-user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecofinds-user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    const users = JSON.parse(localStorage.getItem('ecofinds-users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('ecofinds-users', JSON.stringify(users));
      setUser(updatedUser);
      localStorage.setItem('ecofinds-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};