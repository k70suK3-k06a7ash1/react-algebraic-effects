import { useEffect, useState } from 'react';
import { useEffectEvent } from '../hooks/useEffectEvent';
import { ShoppingEvents, type ShoppingEventPayload, createEventHandlers } from '../effects/events';

interface CartItem {
  id: string;
  name: string;
  price: number;
}

interface ShoppingCartProps {
  theme: 'light' | 'dark';
}

export function ShoppingCart({ theme }: ShoppingCartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const eventHandlers = createEventHandlers();

  // Effect Event that can access latest theme without causing re-sync
  const onPurchaseCompleted = useEffectEvent(() => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const payload: ShoppingEventPayload = {
      itemCount: items.length,
      total,
      theme,
      timestamp: Date.now(),
    };
    eventHandlers.shopping.onPurchaseCompleted(payload);
  });

  // Effect for handling checkout completion
  useEffect(() => {
    if (isCheckingOut) {
      const timer = setTimeout(() => {
        onPurchaseCompleted(); // Uses latest theme value
        setItems([]); // Clear cart
        setIsCheckingOut(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCheckingOut]); // Only reactive to isCheckingOut, not theme

  const addItem = () => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      name: `Item ${items.length + 1}`,
      price: Math.floor(Math.random() * 100) + 10
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const checkout = () => {
    if (items.length > 0) {
      setIsCheckingOut(true);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f9f9f9',
      color: theme === 'dark' ? '#fff' : '#333',
      border: '1px solid #ccc',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3>Shopping Cart</h3>
      <p>Theme: {theme}</p>
      <p>Event: {ShoppingEvents.PurchaseCompleted}</p>
      
      <div style={{ margin: '15px 0' }}>
        <button onClick={addItem} style={{ marginRight: '10px' }}>
          Add Random Item
        </button>
        <button 
          onClick={checkout} 
          disabled={items.length === 0 || isCheckingOut}
          style={{ 
            backgroundColor: isCheckingOut ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: items.length === 0 || isCheckingOut ? 'not-allowed' : 'pointer'
          }}
        >
          {isCheckingOut ? 'Processing...' : 'Checkout'}
        </button>
      </div>

      <div>
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {items.map(item => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px',
                backgroundColor: theme === 'dark' ? '#444' : '#fff',
                margin: '5px 0',
                borderRadius: '4px'
              }}>
                <span>{item.name} - ${item.price}</span>
                <button 
                  onClick={() => removeItem(item.id)}
                  style={{ 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
              Total: ${total}
            </div>
          </>
        )}
      </div>
      
      <p style={{ fontSize: '0.9em', marginTop: '15px' }}>
        Check console for purchase notifications
      </p>
    </div>
  );
}