/**
 * Debugging utilities to help track API calls and component lifecycle
 */

// Set to true to enable console logging
export const DEBUG_MODE = true;

/**
 * Log a message if debug mode is enabled
 */
export function debugLog(message: string, ...args: any[]) {
  if (!DEBUG_MODE) return;
  
  console.log(`[DEBUG] ${message}`, ...args);
}

/**
 * Counts API calls to specific endpoints
 */
export class APICallTracker {
  private static calls: Record<string, number> = {};
  
  /**
   * Register a call to an endpoint
   */
  static trackCall(endpoint: string) {
    if (!this.calls[endpoint]) {
      this.calls[endpoint] = 0;
    }
    this.calls[endpoint]++;
    
    if (DEBUG_MODE) {
      console.log(`[API Call] ${endpoint}: ${this.calls[endpoint]} calls`);
    }
  }
  
  /**
   * Get the current call count for an endpoint
   */
  static getCallCount(endpoint: string): number {
    return this.calls[endpoint] || 0;
  }
  
  /**
   * Reset tracking for an endpoint or all endpoints
   */
  static reset(endpoint?: string) {
    if (endpoint) {
      this.calls[endpoint] = 0;
    } else {
      this.calls = {};
    }
  }
  
  /**
   * Get a summary of all tracked calls
   */
  static getSummary(): Record<string, number> {
    return { ...this.calls };
  }
}

/**
 * Create a wrapped fetch function that tracks API calls
 */
export function createTrackedFetch() {
  const originalFetch = window.fetch;
  
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.url;
    
    // Extract the endpoint from the URL
    const endpoint = url.split('/').pop() || url;
    APICallTracker.trackCall(endpoint);
    
    return originalFetch(input, init);
  };
  
  return () => {
    // Restore the original fetch if needed
    window.fetch = originalFetch;
  };
}
