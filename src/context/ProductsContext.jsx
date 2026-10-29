import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/mockData';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('bolddee_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS.map((p, idx) => ({
      ...p,
      featured: p.featured ?? (idx < 6),
      in_stock: p.in_stock ?? true,
      image_urls: p.image_urls || (p.image ? [p.image] : ['/images/custom_sash.jpg']),
    }));
  });

  // Fetch real product catalogue from backend API
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          localStorage.setItem('bolddee_products', JSON.stringify(data.products));
        }
      }
    } catch (err) {
      console.warn('Backend API offline or unreachable, using local cache:', err.message);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('bolddee_admin_token') || localStorage.getItem('bolddee_user_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const addProduct = async (newProduct) => {
    const created = {
      ...newProduct,
      id: `p-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      image: newProduct.image_urls?.[0] || '/images/rental_equipment.jpg',
      image_urls: newProduct.image_urls?.length ? newProduct.image_urls : ['/images/rental_equipment.jpg'],
      in_stock: true,
      featured: newProduct.featured || false,
    };

    setProducts((prev) => [created, ...prev]);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(newProduct)
      });
      refreshProducts();
    } catch (err) {
      console.error('Failed to save to backend API:', err);
    }

    return created;
  };

  const updateProduct = async (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(updatedFields)
      });
      refreshProducts();
    } catch (err) {
      console.error('Failed to update in backend API:', err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
    } catch (err) {
      console.error('Failed to delete in backend API:', err);
    }
  };

  const toggleFeatured = (id) => {
    const p = products.find((prod) => prod.id === id);
    if (p) updateProduct(id, { featured: !p.featured });
  };

  const toggleInStock = (id) => {
    const p = products.find((prod) => prod.id === id);
    if (p) updateProduct(id, { in_stock: !p.in_stock });
  };

  const resetToDefault = () => {
    const resetList = INITIAL_PRODUCTS.map((p, idx) => ({
      ...p,
      featured: idx < 6,
      in_stock: true,
      image_urls: p.image ? [p.image] : ['/images/custom_sash.jpg'],
    }));
    setProducts(resetList);
    localStorage.removeItem('bolddee_products');
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
        toggleInStock,
        resetToDefault,
        refreshProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
