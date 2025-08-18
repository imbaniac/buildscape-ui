import { redirect } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  // Redirect to home - the map is the home page
  throw redirect(301, "/");
};
