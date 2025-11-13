/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Global type declarations
declare global {
  // Google Analytics gtag function
  function gtag(...args: any[]): void;

  interface Window {
    gtag?: (...args: any[]) => void;
    TyingAI?: any;
  }
}

export {};