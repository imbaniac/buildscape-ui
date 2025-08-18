import { browser } from "$app/environment";
import { overviewStore } from "$lib/stores/overviewStore";
import type { LayoutLoad } from "./$types";
import posthog from "posthog-js";
import { analytics } from "$lib/analytics";

// Enable SSR for all pages by default
export const ssr = true;

export const load: LayoutLoad = async ({ data }) => {
  // Only load on client side and if not already loaded
  // This is fine for the overview store as it's used for the interactive map
  // which is a client-side feature
  if (browser) {
    const currentState = overviewStore.getState();

    // Only load if we don't have data
    if (!currentState.data && !currentState.isLoading) {
      overviewStore.load();
    }

    // Only initialize PostHog if API key is provided and not in development
    const posthogApiKey = import.meta.env.PUBLIC_POSTHOG_API_KEY;
    const isDevelopment = import.meta.env.DEV;

    if (posthogApiKey && !posthog.__loaded && !isDevelopment) {
      posthog.init(posthogApiKey, {
        api_host: window.location.origin + "/ingest",
        ui_host: "https://us.posthog.com",
        person_profiles: "identified_only",
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage",
        loaded: () => {
          // Initialize analytics after PostHog loads
          analytics.init();
        },
      });

      // Make PostHog available globally for autocapture
      if (typeof window !== "undefined") {
        window.posthog = posthog;
      }
    }
  }

  // Return server data (including chains) merged with any client data
  return {
    ...data, // This preserves the chains from +layout.server.ts
  };
};
