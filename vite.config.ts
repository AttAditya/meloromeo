import { defineConfig } from "vite";

export default defineConfig({
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

