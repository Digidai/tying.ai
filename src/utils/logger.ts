/**
 * Logger utility - only logs in development mode
 * Automatically stripped in production builds
 */

/* eslint-disable no-console */
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },

  info: (...args: unknown[]) => {
    if (isDev) {
      console.info(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Performance logging - only in development
   */
  perf: (label: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`[PERF] ${label}:`, ...args);
    }
  },

  /**
   * Group logging - only in development
   */
  group: (label: string) => {
    if (isDev) {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  }
};

// Default export for convenience
export default logger;
/* eslint-enable no-console */
