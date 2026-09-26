import { defineConfig } from 'vitest/config';

/**
 * The base Vitest configuration for the project. Extended by individual package configurations.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
    },
  },
});
