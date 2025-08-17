import { useState } from 'react'
import { ChatRoom } from './components/ChatRoom'
import { PageAnalytics } from './components/PageAnalytics'
import { ShoppingCart } from './components/ShoppingCart'
import './App.css'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [roomId, setRoomId] = useState('general')
  const [url, setUrl] = useState('/home')
  const [userId, setUserId] = useState<string | undefined>('user123')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      padding: '20px'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>React Algebraic Effects with useEffectEvent</h1>
        <p>
          Examples demonstrating separation of events from effects using the experimental useEffectEvent hook
        </p>
        
        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={toggleTheme}
            style={{
              padding: '10px 20px',
              backgroundColor: theme === 'dark' ? '#007bff' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Toggle Theme ({theme})
          </button>
        </div>
      </header>

      <main>
        <section style={{ marginBottom: '30px' }}>
          <h2>1. Chat Room Connection</h2>
          <p>
            Demonstrates how useEffectEvent allows the connection notification to access 
            the latest theme without causing the connection effect to re-run.
          </p>
          
          <div style={{ margin: '10px 0' }}>
            <label>
              Room ID: 
              <select 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="general">general</option>
                <option value="random">random</option>
                <option value="help">help</option>
              </select>
            </label>
          </div>
          
          <ChatRoom roomId={roomId} theme={theme} />
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2>2. Page Analytics</h2>
          <p>
            Shows how analytics logging can access the latest userId without 
            re-triggering the page visit effect when user changes.
          </p>
          
          <div style={{ margin: '10px 0' }}>
            <label>
              URL: 
              <select 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="/home">Home</option>
                <option value="/about">About</option>
                <option value="/contact">Contact</option>
              </select>
            </label>
            
            <label style={{ marginLeft: '20px' }}>
              User ID: 
              <input 
                type="text" 
                value={userId || ''} 
                onChange={(e) => setUserId(e.target.value || undefined)}
                placeholder="Enter user ID"
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </label>
          </div>
          
          <PageAnalytics url={url} userId={userId} />
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2>3. Shopping Cart</h2>
          <p>
            Illustrates how checkout completion notifications can use the current theme 
            without the checkout effect re-running when theme changes.
          </p>
          
          <ShoppingCart theme={theme} />
        </section>

        <section style={{ 
          backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '40px'
        }}>
          <h2>Key Benefits of useEffectEvent</h2>
          <ul style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
            <li>
              <strong>Separation of Concerns:</strong> Separates reactive logic (what should cause re-sync) 
              from non-reactive logic (event handlers that need latest values)
            </li>
            <li>
              <strong>Performance:</strong> Prevents unnecessary effect re-runs when non-reactive 
              dependencies change
            </li>
            <li>
              <strong>Predictable Behavior:</strong> Makes it clear which values are reactive 
              and which are just accessed for their latest value
            </li>
            <li>
              <strong>Cleaner Code:</strong> Eliminates the need for useCallback and complex 
              dependency arrays in many cases
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
