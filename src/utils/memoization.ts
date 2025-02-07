// src/utils/memoization.ts

type AnyFunction = (...args: any[]) => any;

/**
 * Memoization decorator for class methods
 * Caches results based on stringified arguments
 */
export function memoize() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('Memoize decorator can only be applied to methods');
    }

    const originalMethod = descriptor.value;
    const cacheKey = Symbol(`__memoized_${propertyKey}`);

    descriptor.value = function (...args: any[]) {
      // Initialize cache if it doesn't exist
      if (!this[cacheKey]) {
        this[cacheKey] = new Map<string, any>();
      }

      const key = JSON.stringify(args);
      const cache = this[cacheKey];

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = originalMethod.apply(this, args);
      cache.set(key, result);

      // Limit cache size to prevent memory leaks
      if (cache.size > 1000) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Debounce decorator for class methods
 * Ensures method is not called more frequently than specified delay
 */
export function debounce(delay: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('Debounce decorator can only be applied to methods');
    }

    const originalMethod = descriptor.value;
    const timeoutKey = Symbol(`__debounced_${propertyKey}_timeout`);

    descriptor.value = function (...args: any[]) {
      clearTimeout(this[timeoutKey]);

      this[timeoutKey] = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}

/**
 * Throttle decorator for class methods
 * Ensures method is not called more frequently than specified interval
 */
export function throttle(interval: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('Throttle decorator can only be applied to methods');
    }

    const originalMethod = descriptor.value;
    const lastCallKey = Symbol(`__throttled_${propertyKey}_lastCall`);

    descriptor.value = function (...args: any[]) {
      const now = Date.now();

      if (!this[lastCallKey] || now - this[lastCallKey] >= interval) {
        this[lastCallKey] = now;
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}