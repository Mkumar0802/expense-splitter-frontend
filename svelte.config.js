import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Enable Vite preprocessing (for scripts, styles, etc.)
  preprocess: vitePreprocess(),

  kit: {
    // This is needed for Vite to correctly resolve paths in a non-SvelteKit app
    alias: {
      $components: "./src/components",
      $pages: "./src/pages",
      $api: "./src/api"
    }
  }
};

export default config;
