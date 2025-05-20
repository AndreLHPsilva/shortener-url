import { defineConfig } from "vitest/config";
import path from "path";
import { config } from "dotenv";
config();

export default defineConfig({
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "src/domain"),
      "@application": path.resolve(__dirname, "src/application"),
      "@infrastructure": path.resolve(__dirname, "src/infrastructure"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@presentation": path.resolve(__dirname, "src/presentation"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@tests": path.resolve(__dirname, "src/tests"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    env: {
      NODE_ENV: "test",
      BASE_URL: process.env.BASE_URL,
    }
  },
});
