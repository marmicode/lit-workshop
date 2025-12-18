import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/kitchen',
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'meal-plan': 'src/meal-plan.ts',
        'recipe-search': 'src/recipe-search.ts',
      },
      formats: ['es'],
    },
  },
});
