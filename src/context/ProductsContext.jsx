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
    // Default initial products with featured flag
    return INITIAL_PRODUCTS.map((p, idx) => ({
      ...p,
      featured: p.featured ?? (idx < 6),
      in_stock: p.in_stock ?? true,
      image_urls: p.image_urls || (p.image ? [p.image] : ['/images/custom_sash.jpg']),
    }));
  });

  useEffect(() => {
    try {
      localStorage.setItem('bolddee_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  const addProduct = (newProduct) => {
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
    return created;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          if (updatedFields.image_urls && updatedFields.image_urls.length > 0) {
            updated.image = updatedFields.image_urls[0];
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleFeatured = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const toggleInStock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, in_stock: !p.in_stock } : p))
    );
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
