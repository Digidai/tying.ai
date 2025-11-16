/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Import meta environment variables
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SITE?: string;
  readonly ASSETS_PREFIX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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