import { defineConfig } from "vite";

export default defineConfig({
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
});
