import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  // Redirect to the static OG image
  throw redirect(301, "/og/map.png");
};
