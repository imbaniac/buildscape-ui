import { redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;

  // Redirect to the static chain OG image
  throw redirect(301, `/og/chain-${slug}.png`);
};
