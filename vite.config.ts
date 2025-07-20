import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import { ngrok } from "vite-plugin-ngrok";

const env = loadEnv("", process.cwd(), "NGROK_TOKEN");

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), ngrok(env.NGROK_TOKEN)],
});
