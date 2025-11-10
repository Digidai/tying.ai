// Global Type Declarations

// Declare gtag as a global function
declare function gtag(command: string, ...args: any[]): void;

// Module augmentation
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    TyingAI?: any;
  }

  interface HTMLElement {
    dataset: DOMStringMap;
  }

  interface CSSStyleDeclaration {
    webkitBackdropFilter?: string;
  }
}

export {};
