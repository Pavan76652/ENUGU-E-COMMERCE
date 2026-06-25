import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.js'],
    testTimeout: 30_000,
    hookTimeout: 120_000,
    include: ['test/**/*.test.js'],
    pool: 'forks',
  },
});
