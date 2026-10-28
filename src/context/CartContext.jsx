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

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryZone, setDeliveryZone] = useState('ZONE_A');

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
          quantity: Math.max(1, quantity),
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
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Fixed financial calculation (eliminates double-multiplication bug)
  let subtotal = 0;
  let securityDeposit = 0;

  for (const item of items) {
    const qty = Math.max(1, item.quantity || 1);
    const unitPrice = Number(item.price) || 0;

    if (item.rentalDetails) {
      const days = Math.max(1, parseInt(item.rentalDetails.days) || 1);
      const rentalCharge = unitPrice * qty * days;
      const depositPerUnit = Number(item.deposit || item.rentalDetails.deposit || 0);
      const depositCharge = depositPerUnit * qty;

      subtotal += rentalCharge;
      securityDeposit += depositCharge;
    } else {
      subtotal += unitPrice * qty;
    }
  }

  // Delivery zone fee
  let deliveryFee = 50; // Zone A
  if (deliveryZone === 'ZONE_B') deliveryFee = 100;
  if (deliveryZone === 'ZONE_C') deliveryFee = 150;

  // Coupon discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.discount_value) / 100);
    } else {
      discount = Math.min(subtotal, appliedCoupon.discount_value);
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + securityDeposit);
  const requiredDeposit60 = Math.round(grandTotal * 0.60);
  const balanceDue = grandTotal - requiredDeposit60;
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'GRAD2027') {
      const coupon = { code: 'GRAD2027', discount_type: 'percent', discount_value: 10, label: '10% Off Graduation' };
      setAppliedCoupon(coupon);
      setCouponCode(clean);
      return { success: true, message: 'Coupon GRAD2027 applied (10% Off)' };
    }
    if (clean === 'BOLD50') {
      const coupon = { code: 'BOLD50', discount_type: 'fixed', discount_value: 50, label: 'GH₵ 50 Off' };
      setAppliedCoupon(coupon);
      setCouponCode(clean);
      return { success: true, message: 'Coupon BOLD50 applied (GH₵ 50 Off)' };
    }
    return { success: false, message: 'Invalid or expired promo code' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        securityDeposit,
        discount,
        total: grandTotal,
        requiredDeposit60,
        balanceDue,
        itemCount,
        deliveryZone,
        setDeliveryZone,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon
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
