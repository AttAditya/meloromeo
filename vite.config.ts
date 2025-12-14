import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [viteSingleFile()],
  base: "./",
  resolve: {
    alias: {
      "@instances": "/src/instances",
      "@config": "/src/config",
      "@entities": "/src/entities",
      "@logic": "/src/logic",
    },
  },
});

