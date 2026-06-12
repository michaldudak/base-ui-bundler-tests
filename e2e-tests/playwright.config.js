import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  reporter: process.env.CI ? [['dot'], ['html', { open: 'never' }]] : 'list',
  use: {
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
});
