import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// Use the function form of defineConfig to access the command
export default defineConfig(({ command }) => {
  const config = {
    server: {
      host: "::",
      port: 8080,
      https: undefined, // Default to undefined
    },
    plugins: [dyadComponentTagger(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };

  // Only apply HTTPS config for the dev server ('serve' command)
  // and when the VITE_HTTPS environment variable is explicitly set.
  if (command === 'serve' && process.env.VITE_HTTPS === 'true') {
    try {
      config.server.https = {
        key: fs.readFileSync(path.resolve(__dirname, './certs/localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, './certs/localhost-cert.pem')),
      };
    } catch (e) {
      console.warn('HTTPS certificates not found. Starting dev server in HTTP mode.');
    }
  }

  return config;
});