import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from '../../vitest.config.ts';

/**
 * Vitest configuration for the Infra package.
 * Extends the base configuration with Infra-specific settings.
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: ['**/src/app.ts'],
      coverage: {
        exclude: ['**/src/app.ts'],
      },
    },
  }),
);
