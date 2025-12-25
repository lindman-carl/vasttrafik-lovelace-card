import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  // In production, replace VITE_ env vars with undefined so they don't leak into the bundle
  define:
    mode === "production"
      ? {
          "import.meta.env.VITE_VASTTRAFIK_CLIENT_ID": "undefined",
          "import.meta.env.VITE_VASTTRAFIK_CLIENT_SECRET": "undefined",
          "import.meta.env.VITE_VASTTRAFIK_GID": "undefined",
          "import.meta.env.VITE_VASTTRAFIK_STOP_NAME": "undefined",
        }
      : {},
  build: {
    copyPublicDir: false,
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      output: {
        dir: "dist",
        entryFileNames: "[hash].js",
      },
    },
  },
}));
