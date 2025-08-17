// Event definitions as const objects
export const ChatEvents = {
  Connected: 'chat:connected',
  Disconnected: 'chat:disconnected',
  MessageReceived: 'chat:message-received',
} as const;

export const AnalyticsEvents = {
  PageVisit: 'analytics:page-visit',
  UserAction: 'analytics:user-action',
  SessionStart: 'analytics:session-start',
} as const;

export const ShoppingEvents = {
  ItemAdded: 'shopping:item-added',
  ItemRemoved: 'shopping:item-removed',
  CheckoutStarted: 'shopping:checkout-started',
  PurchaseCompleted: 'shopping:purchase-completed',
} as const;

// Event payload types
export interface ChatEventPayload {
  roomId: string;
  theme: 'light' | 'dark';
  timestamp: number;
}

export interface AnalyticsEventPayload {
  url: string;
  userId?: string;
  timestamp: number;
}

export interface ShoppingEventPayload {
  itemCount: number;
  total: number;
  theme: 'light' | 'dark';
  timestamp: number;
}

// Event handlers
export const createEventHandlers = () => ({
  chat: {
    onConnected: (payload: ChatEventPayload) => {
      console.log(`🔔 Connected to room "${payload.roomId}" (Theme: ${payload.theme}) at ${new Date(payload.timestamp).toLocaleTimeString()}`);
    },
    onDisconnected: (payload: ChatEventPayload) => {
      console.log(`❌ Disconnected from room "${payload.roomId}" at ${new Date(payload.timestamp).toLocaleTimeString()}`);
    },
  },
  
  analytics: {
    onPageVisit: (payload: AnalyticsEventPayload) => {
      console.log(`📊 Page visit: ${payload.url} by ${payload.userId || 'anonymous'} at ${new Date(payload.timestamp).toLocaleTimeString()}`);
    },
  },
  
  shopping: {
    onPurchaseCompleted: (payload: ShoppingEventPayload) => {
      console.log(`🛒 Purchase completed! ${payload.itemCount} items, total: $${payload.total} (Theme: ${payload.theme}) at ${new Date(payload.timestamp).toLocaleTimeString()}`);
    },
  },
});