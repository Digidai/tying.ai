/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/* eslint-enable @typescript-eslint/triple-slash-reference */

// Import meta environment variables
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SITE?: string;
  readonly ASSETS_PREFIX?: string;
  readonly PUBLIC_OPENROUTER_API_KEY?: string;
  readonly PUBLIC_JINA_API_KEY?: string;
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
