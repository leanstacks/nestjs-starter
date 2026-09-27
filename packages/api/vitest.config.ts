import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from '../../vitest.config.ts';

/**
 * Vitest configuration for the API package.
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      root: './',
    },
  }),
);
