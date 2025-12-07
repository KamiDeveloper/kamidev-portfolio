import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Debounce function to limit the rate of function execution
 * Useful for resize, scroll, and input events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user prefers reduced motion
 * Important for accessibility
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Throttle function to limit execution to once per interval
 * Better for high-frequency events like scroll
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Safe localStorage access with fallback
 */
export function safeLocalStorage() {
  const isSupported = typeof window !== 'undefined' && 'localStorage' in window;

  return {
    getItem: (key: string): string | null => {
      if (!isSupported) return null;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      if (!isSupported) return;
      try {
        localStorage.setItem(key, value);
      } catch {
        console.warn('LocalStorage is not available');
      }
    },
    removeItem: (key: string): void => {
      if (!isSupported) return;
      try {
        localStorage.removeItem(key);
      } catch {
        console.warn('LocalStorage is not available');
      }
    }
  };
}
