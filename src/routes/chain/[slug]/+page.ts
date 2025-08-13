import type { PageLoad } from "./$types";

// Overview page just uses the layout data
export const load: PageLoad = async () => {
  // All data is loaded in +layout.ts
  return {};
};

export const prerender = "auto";
export const ssr = true;
