import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/kitchen',
  build: {
    lib: {
      entry: {
        'meal-plan': 'src/feature-meal-plan/index.ts',
        'recipe-search': 'src/feature-recipe-search/index.ts',
      },
      formats: ['es'],
    },
  },
  plugins: [
    dts({
      tsconfigPath: 'tsconfig.lib.json',
    }),
    nxViteTsPaths(),
  ],
});
