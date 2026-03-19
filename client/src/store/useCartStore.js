import { create } from 'zustand';

// Domain Models handled here implicitly:
// CartItem: id, product_id, quantity.
// User/Order data handled during checkout.

export const useCartStore = create((set, get) => ({
  items: [],
  isCartOpen: false,
  loyaltyPoints: 0,
  
  addItem: (product) => set((state) => {
    // Check stock
    if (product.stock_count <= 0) return state;

    const existingItem = state.items.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock_count) return state; // Can't add more than stock

      return {
        items: state.items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
        isCartOpen: true
      };
    }
    return { 
      items: [...state.items, { ...product, quantity: 1 }],
      isCartOpen: true 
    };
  }),
  
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId)
  })),

  updateQuantity: (productId, quantity) => set((state) => {
    const item = state.items.find(i => i.id === productId);
    if (!item) return state;
    
    const validQuantity = Math.max(0, Math.min(quantity, item.stock_count));
    
    return {
      items: validQuantity <= 0 
        ? state.items.filter(i => i.id !== productId)
        : state.items.map(i => i.id === productId ? { ...i, quantity: validQuantity } : i)
    };
  }),

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  closeCart: () => set({ isCartOpen: false }),

  clearCart: () => set({ items: [] }),

  checkout: () => {
    const state = get();
    // Simulate stock deduction and loyalty points calculation
    // Award 1 point per $10 spent on coffee
    const pointsEarned = Math.floor(
      state.items
        .filter(item => item.category === 'coffee')
        .reduce((sum, item) => sum + (item.price * item.quantity), 0) / 10
    );

    set((state) => ({
      items: [],
      isCartOpen: false,
      loyaltyPoints: state.loyaltyPoints + pointsEarned
    }));

    return pointsEarned;
  }
}));
