import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Experimental useEffectEvent hook implementation
 * Allows extracting non-reactive logic from Effects
 */
export function useEffectEvent<Args extends unknown[], Return>(
  handler: (...args: Args) => Return,
): (...args: Args) => Return {
  const handlerRef = useRef(handler);

  // Update the ref during render so it's always current
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  // Return a stable function that calls the latest handler
  return useCallback((...args: Args) => {
    const fn = handlerRef.current;
    return fn(...args);
  }, []);
}