import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  // Temporary redirect to home until chains table is implemented
  throw redirect(301, '/');
};