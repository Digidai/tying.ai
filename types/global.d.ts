// Global type definitions for Tying.ai

declare global {
  interface Window {
    TyingAI: {
      app: MainApp;
    };
    gtag?: (command: string, ...args: any[]) => void;
  }

  interface Document {
    querySelector<T extends Element>(selectors: string): T | null;
    querySelectorAll<T extends Element>(selectors: string): NodeListOf<T>;
  }

  interface HTMLElement {
    dataset: DOMStringMap & {
      animation?: string;
      animationObserved?: string;
      counter?: string;
      staggered?: string;
      counted?: string;
      glassEffect?: string;
      hoverEffect?: string;
      menuEnhanced?: string;
      rippleEffect?: string;
      smoothScroll?: string;
      shimmerInit?: string;
      parallax?: string;
    };
  }

  interface PerformanceTiming {
    loadEventEnd: number;
    loadEventStart: number;
  }

  interface PerformanceEntry {
    startTime: number;
    name: string;
  }
}

// Application-specific types
export interface MainApp {
  init(): Promise<void>;
  destroy(): void;
  getPerformanceMode(): boolean;
}

// Performance types
export interface PerformanceMetrics {
  pageLoadTime: number | null;
  firstPaint: number | null;
  firstContentfulPaint: number | null;
}

export interface ConnectionInfo {
  effectiveType: string;
  downlink?: number;
  rtt?: number;
}

// Animation types
export interface AnimationEventDetail {
  element: Element;
  animationType: string;
}

export interface CounterEventDetail {
  element: Element;
  target: number;
}

// Navigation types
export interface MobileMenuToggleEventDetail {
  isOpen: boolean;
}

// Error handling types
export interface ErrorEventDetail {
  error: Error;
  context?: string;
}

// Component types
export interface CardComponent {
  category?: string;
  title: string;
  description: string;
  link?: string;
}

// Performance monitoring types
export interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
}

// Event types
export interface CustomEventMap {
  'elementAnimated': CustomEvent<AnimationEventDetail>;
  'counterAnimated': CustomEvent<CounterEventDetail>;
  'mobileMenuToggle': CustomEvent<MobileMenuToggleEventDetail>;
  'buttonClicked': CustomEvent<{ button: Element; event: Event }>;
  'formSubmitted': CustomEvent<{ form: HTMLFormElement; event: Event }>;
  'inputValidated': CustomEvent<{ input: HTMLInputElement; isValid: boolean; errorMessage?: string }>;
  'rippleCreated': CustomEvent<{ button: Element; ripple: Element }>;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// DOM helper types
export type SelectableElement = Element | HTMLElement | Document;
export type EventTarget = Element | HTMLElement | Document | Window;

// Performance observer types
export type PerformanceObserverEntry = PerformanceEntry & {
  value?: number;
  id?: string;
  processingStart?: number;
};

// CSS custom properties
export interface CSSCustomProperties {
  '--primary-color'?: string;
  '--transition-fast'?: string;
  '--transition-normal'?: string;
  '--header-height'?: string;
}

export {};