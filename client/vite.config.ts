import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const bffTarget = process.env.VITE_BFF_URL ?? "http://localhost:4001";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: bffTarget,
        changeOrigin: true,
      },
    },
  },
});
