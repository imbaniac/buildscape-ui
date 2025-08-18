import { redirect } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
  const searchQuery = url.searchParams.get("q");

  if (searchQuery) {
    redirect(302, `/?q=${encodeURIComponent(searchQuery)}`);
  } else {
    redirect(302, "/");
  }
};
