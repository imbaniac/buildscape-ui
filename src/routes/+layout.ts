import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";
import { overviewStore } from "$lib/stores/overviewStore";
import type { LayoutLoad } from "./$types";
import posthog from "posthog-js";
import { analytics } from "$lib/analytics";

// Enable SSR for all pages by default
export const ssr = true;

export const load: LayoutLoad = async () => {
  // Only load on client side and if not already loaded
  // This is fine for the overview store as it's used for the interactive map
  // which is a client-side feature
  if (browser) {
    const currentState = overviewStore.getState();

    // Only load if we don't have data
    if (!currentState.data && !currentState.isLoading) {
      overviewStore.load();
    }

    // Only initialize PostHog if API key is provided
    const posthogApiKey = env.PUBLIC_POSTHOG_API_KEY;
    if (posthogApiKey && !posthog.__loaded) {
      posthog.init(posthogApiKey, {
        api_host: "/bscape-metrics",
        ui_host: "https://us.posthog.com",
        person_profiles: "identified_only",
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage",
        loaded: () => {
          // Initialize analytics after PostHog loads
          analytics.init();
        }
      });
    }
  }

  return {};
};
