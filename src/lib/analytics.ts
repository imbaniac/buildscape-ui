import { browser } from "$app/environment";
import posthog from "posthog-js";

export type AnalyticsEvent = {
  // Chain engagement - PostHog can't measure time spent on a page in SPAs
  chain_view_duration: {
    chain_name: string;
    chain_id: number;
    duration_seconds: number;
  };
  
  // Search with no results - valuable for understanding missing chains
  search_no_results: {
    query: string;
  };
  
  // Search that led to navigation - shows successful discovery
  search_converted: {
    query: string;
    selected_chain: string;
  };
};

class Analytics {
  private enabled: boolean = false;

  init() {
    this.enabled =
      browser && typeof posthog !== "undefined" && posthog.__loaded;
  }

  track<T extends keyof AnalyticsEvent>(
    event: T,
    properties: AnalyticsEvent[T],
  ): void {
    if (!this.enabled) return;

    try {
      posthog.capture(event, properties);
    } catch (error) {
      console.warn("Analytics tracking error:", error);
    }
  }

  // Helper for SPA navigation tracking
  trackPageView(url: string, pathname: string): void {
    if (!this.enabled) return;

    try {
      posthog.capture("$pageview", {
        $current_url: url,
        $pathname: pathname,
      });
    } catch (error) {
      console.warn("Analytics pageview tracking error:", error);
    }
  }
}

export const analytics = new Analytics();
