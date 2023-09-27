/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig, loadEnv } from "vite";
import pluginRewriteAll from "vite-plugin-rewrite-all";

dotenv.config(); // load env vars from .env
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [pluginRewriteAll(), react()],

    server: {
      host: true,
      strictPort: true,
      port: 3001,
    },
  });
};
