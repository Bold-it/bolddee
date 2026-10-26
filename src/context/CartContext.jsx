import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bolddee_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bolddee_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (product, quantity = 1, customization = null, rentalDetails = null) => {
    setItems((prev) => {
      // If it's a generic product without special customization or rental details, group by id
      if (!customization && !rentalDetails) {
        const existingIdx = prev.findIndex(
          (item) => item.id === product.id && !item.customization && !item.rentalDetails
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        }
      }

      const cartKey = `${product.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      return [
        ...prev,
        {
          ...product,
          cartKey,
          quantity,
          customization,
          rentalDetails,
        },
      ];
    });
  };

  const removeItem = (cartKey) => {
    setItems((prev) => prev.filter((item) => (item.cartKey || item.id) !== cartKey));
  };

  const updateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      removeItem(cartKey);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if ((item.cartKey || item.id) === cartKey) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => {
    if (item.rentalDetails?.grandTotal) {
      return acc + item.rentalDetails.grandTotal * (item.quantity || 1);
    }
    return acc + (Number(item.price) || 0) * (item.quantity || 1);
  }, 0);

  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
