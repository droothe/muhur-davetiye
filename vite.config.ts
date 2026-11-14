import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ command }) => ({
  plugins: [
    tanstackStart({ server: { entry: "server" } }),
    ...(command === "build"
      ? [(await import("nitro/vite")).nitro({ defaultPreset: "cloudflare-module" })]
      : []),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
  ],
}));
