import { defineConfig } from "vite";

export default defineConfig({
  base: "/taxi-dashboard/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
