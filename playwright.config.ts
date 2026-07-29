import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
