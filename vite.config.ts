import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; // if using Vue; install with npm install --save-dev @vitejs/plugin-vue

export default defineConfig({
  // adjust root if needed (e.g., to "src" or another folder)
  root: "./vueSrc/",
  publicDir: "public",
  build: {
    outDir: "dist",
    // other build options as required
  },
  plugins: [vue()],
});
