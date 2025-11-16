/**
 * Logger utility - only logs in development mode
 * Automatically stripped in production builds
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },

  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Performance logging - only in development
   */
  perf: (label: string, ...args: any[]) => {
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
