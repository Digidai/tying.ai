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

/* eslint-disable @typescript-eslint/no-unused-vars */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// Global type declarations
declare global {
  // Google Analytics gtag function
  function gtag(...args: unknown[]): void;

  interface Window {
    gtag?: (...args: unknown[]) => void;
    TyingAI?: Record<string, unknown>;
  }
}

export {};
