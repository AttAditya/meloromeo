import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [viteSingleFile()],
  base: "./",
  resolve: {
    alias: {
      "@instances": "/src/core/instances",
      "@flow": "/src/core/flow",
      "@assets": "/src/assets",
      "@config": "/src/config",
      "@entities": "/src/entities",
      "@logic": "/src/logic",
      "@inputs": "/src/inputs",
      "@scenes": "/src/scenes",
      "@ui": "/src/ui",
    },
  },
});

