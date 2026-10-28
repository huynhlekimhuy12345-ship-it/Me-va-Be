import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/common/Toast';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'nga_pijama_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [badgeBounced, setBadgeBounced] = useState(false);
  const { showToast } = useToast();

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Lỗi lưu giỏ hàng:', e);
    }
  }, [items]);

  // Trigger bounce animation on cart icon
  const triggerBounce = () => {
    setBadgeBounced(true);
    setTimeout(() => setBadgeBounced(false), 500);
  };

  const addToCart = useCallback(
    (product, variant, quantity = 1) => {
      if (!variant) return false;

      // Check stock
      if (variant.stock <= 0) {
        showToast('Biến thể này hiện đã hết hàng rồi mẹ ơi!', 'error');
        return false;
      }

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((it) => it.variantId === variant.id);
        const currentQty = existingIndex > -1 ? prevItems[existingIndex].quantity : 0;
        const newQty = currentQty + quantity;

        if (newQty > variant.stock) {
          showToast(`Chỉ còn ${variant.stock} sản phẩm trong kho!`, 'error');
          return prevItems;
        }

        let updated;
        if (existingIndex > -1) {
          updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            price: product.price,
            stock: variant.stock,
          };
        } else {
          updated = [
            ...prevItems,
            {
              productId: product.id,
              variantId: variant.id,
              name: product.name,
              slug: product.slug,
              image: product.images?.[0]?.url || product.image || '',
              size: variant.size,
              color: variant.color,
              price: product.price,
              originalPrice: product.originalPrice || product.price,
              quantity: quantity,
              stock: variant.stock,
            },
          ];
        }

        showToast(`Đã thêm "${product.name} (${variant.size})" vào giỏ hàng!`, 'success');
        triggerBounce();
        return updated;
      });

      return true;
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (variantId, newQuantity) => {
      if (newQuantity <= 0) {
        return;
      }

      setItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.variantId === variantId) {
            if (newQuantity > item.stock) {
              showToast(`Kho chỉ còn ${item.stock} sản phẩm này!`, 'error');
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      });
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (variantId) => {
      setItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId));
      showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const totalItems = items.reduce((acc, it) => acc + (it.quantity || 0), 0);
  const totalAmount = items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItems,
        totalAmount,
        badgeBounced,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
