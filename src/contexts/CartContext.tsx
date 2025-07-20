
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    province: string;
  };
  paymentMethod: string;
  subtotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

interface CartState {
  items: CartItem[];
  lastOrder: Order | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LAST_ORDER'; payload: Order }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'SET_LAST_ORDER':
      return {
        ...state,
        lastOrder: action.payload,
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  lastOrder: Order | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  createOrder: (customer: Order['customer'], paymentMethod: string) => Order;
  itemCount: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    lastOrder: null,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const createOrder = (customer: Order['customer'], paymentMethod: string): Order => {
    const orderId = `ORD-${Date.now()}`;
    const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    const order: Order = {
      id: orderId,
      items: [...state.items],
      customer,
      paymentMethod,
      subtotal,
      total,
      status: paymentMethod === 'cash' ? 'confirmed' : 'pending',
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'SET_LAST_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });

    // Save order to localStorage for persistence
    const savedOrders = localStorage.getItem('orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    return order;
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        lastOrder: state.lastOrder,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        createOrder,
        itemCount,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
