import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      port: process.env.VITE_PORT,
      proxy: {
        "/api": {
          changeOrigin: true,
          target: process.env.VITE_PROXY_URI
        }
      },
    },
    plugins: [react()],
  });
};
