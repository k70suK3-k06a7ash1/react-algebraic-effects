import { useEffect, useState } from 'react';
import { useEffectEvent } from '../hooks/useEffectEvent';
import { ChatEvents,type ChatEventPayload, createEventHandlers } from '../effects/events';

interface Connection {
  connect(): void;
  disconnect(): void;
  on(event: string, callback: () => void): void;
  off(event: string, callback: () => void): void;
}

// Mock connection factory
function createConnection(serverUrl: string, roomId: string): Connection {
  let connected = false;
  let listeners: Record<string, (() => void)[]> = {};

  return {
    connect() {
      if (!connected) {
        connected = true;
        console.log(`✅ Connecting to "${roomId}" room at ${serverUrl}...`);
        setTimeout(() => {
          listeners[ChatEvents.Connected]?.forEach(callback => callback());
        }, 1000);
      }
    },
    disconnect() {
      if (connected) {
        connected = false;
        listeners[ChatEvents.Disconnected]?.forEach(callback => callback());
      }
    },
    on(event: string, callback: () => void) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    },
    off(event: string, callback: () => void) {
      listeners[event] = listeners[event]?.filter(cb => cb !== callback) || [];
    }
  };
}

interface ChatRoomProps {
  roomId: string;
  theme: 'light' | 'dark';
}

export function ChatRoom({ roomId, theme }: ChatRoomProps) {
  const [serverUrl] = useState('https://localhost:1234');
  const eventHandlers = createEventHandlers();

  // Effect Event - can read latest props without causing re-sync
  const onConnected = useEffectEvent(() => {
    const payload: ChatEventPayload = {
      roomId,
      theme,
      timestamp: Date.now(),
    };
    eventHandlers.chat.onConnected(payload);
  });

  const onDisconnected = useEffectEvent(() => {
    const payload: ChatEventPayload = {
      roomId,
      theme,
      timestamp: Date.now(),
    };
    eventHandlers.chat.onDisconnected(payload);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    
    connection.on(ChatEvents.Connected, onConnected);
    connection.on(ChatEvents.Disconnected, onDisconnected);
    
    connection.connect();
    
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Only reactive to roomId, not theme

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      border: '1px solid #ccc',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3>Chat Room: {roomId}</h3>
      <p>Theme: {theme}</p>
      <p>Check the console to see connection logs</p>
    </div>
  );
}