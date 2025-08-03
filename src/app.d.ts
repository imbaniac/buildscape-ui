// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
    posthog?: any;
  }
}

export {};
