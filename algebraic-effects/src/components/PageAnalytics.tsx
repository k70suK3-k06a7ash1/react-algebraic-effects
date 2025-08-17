import { useEffect, useState } from 'react';
import { useEffectEvent } from '../hooks/useEffectEvent';
import { AnalyticsEvents, type AnalyticsEventPayload, createEventHandlers } from '../effects/events';

interface AnalyticsProps {
  url: string;
  userId?: string;
}

export function PageAnalytics({ url, userId }: AnalyticsProps) {
  const [visitCount, setVisitCount] = useState(0);
  const eventHandlers = createEventHandlers();

  // Effect Event for logging - can access latest userId without re-syncing
  const onPageVisit = useEffectEvent(() => {
    const payload: AnalyticsEventPayload = {
      url,
      userId,
      timestamp: Date.now(),
    };
    eventHandlers.analytics.onPageVisit(payload);
  });

  useEffect(() => {
    // This effect only re-runs when URL changes, not when userId changes
    onPageVisit();
    setVisitCount(prev => prev + 1);
  }, [url]); // Only reactive to url

  return (
    <div style={{ 
      padding: '15px', 
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '6px',
      margin: '10px 0'
    }}>
      <h4>Page Analytics</h4>
      <p>Current URL: {url}</p>
      <p>User ID: {userId || 'Anonymous'}</p>
      <p>Visit Count: {visitCount}</p>
      <p>Event: {AnalyticsEvents.PageVisit}</p>
      <p>Check console for analytics logs</p>
    </div>
  );
}