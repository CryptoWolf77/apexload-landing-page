import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    fs: {
      allow: [projectRoot],
    },
  },
  preview: {
    host: "127.0.0.1",
  },
}));
