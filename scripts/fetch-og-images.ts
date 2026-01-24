import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync } from 'fs';

const TARGET_DIR = 'static/og';

// Skip if images already exist (e.g., in CI cache or local dev)
if (existsSync(TARGET_DIR)) {
  const files = readdirSync(TARGET_DIR).filter((f) => f.endsWith('.png'));
  if (files.length > 0) {
    console.log(`OG images already present (${files.length} files), skipping fetch.`);
    process.exit(0);
  }
}

console.log('Fetching OG images from og-assets branch...');

// Create directory if needed
mkdirSync(TARGET_DIR, { recursive: true });

try {
  // Fetch og-assets branch (works in Cloudflare Pages, Vercel, etc.)
  execSync('git fetch origin og-assets --depth=1', { stdio: 'inherit' });
  execSync(`git checkout origin/og-assets -- ${TARGET_DIR}/`, { stdio: 'inherit' });
  console.log('OG images fetched successfully.');
} catch {
  console.warn('Warning: Could not fetch OG images.');
  console.warn('The og-assets branch may not exist yet. Run the workflow first.');
  // Don't fail the build - OG images are optional for local dev
}
