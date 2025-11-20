import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    // Enable HTTPS for Telegram Mini Apps (optional for local development)
    // For production, use proper SSL certificates from your hosting provider
    https: process.env.VITE_HTTPS === 'true' ? {
      key: fs.readFileSync(path.resolve(__dirname, './certs/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/localhost-cert.pem')),
    } : undefined,
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
