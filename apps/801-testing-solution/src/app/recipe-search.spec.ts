import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { RecipeSearch } from './recipe-search';
import { mount } from './testing/mount';

describe(RecipeSearch.name, () => {
  it('filters recipes by keywords', async () => {
    mount(RecipeSearch);

    await page.getByPlaceholder('Search recipes').fill('bur');
    const heading = page
      .getByRole('listitem')
      .getByRole('heading', { level: 2 });
    await expect.element(heading).toHaveTextContent('Burger');
  });
});
