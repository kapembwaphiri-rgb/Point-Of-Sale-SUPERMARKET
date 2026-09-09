import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => setCart((current) => {
    const existing = current.find((item) => item.id === product.id);
    const stock = Number(product.stock_quantity ?? product.quantity ?? 0);
    if (existing && existing.quantity >= stock) return current;
    return existing ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }];
  });
  const changeQuantity = (id, delta) => setCart((current) => current.map((item) => {
    const stock = Number(item.stock_quantity ?? item.quantity ?? 0);
    const nextQuantity = item.quantity + delta;
    return item.id === id ? { ...item, quantity: Math.min(nextQuantity, stock) } : item;
  }).filter((item) => item.quantity > 0));
  const clearCart = () => setCart([]);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const value = useMemo(() => ({ cart, addToCart, changeQuantity, clearCart, subtotal }), [cart, subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}