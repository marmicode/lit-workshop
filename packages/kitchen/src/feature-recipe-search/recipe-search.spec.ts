import { recipeMother } from '@kitchen/core';
import { recipeRepositorySingleton } from '@kitchen/infra';
import { RecipeRepositoryFake } from '@kitchen/infra/testing';
import { singletonTesting } from '@kitchen/util';
import { mount } from '@kitchen/testing';
import { describe, expect, it, onTestFinished } from 'vitest';
import { page } from 'vitest/browser';
import { RecipeSearch } from './recipe-search';

describe(RecipeSearch.name, () => {
  it('displays all recipes', async () => {
    setUpAndMountRecipeSearch();

    const headings = page
      .getByRole('listitem')
      .getByRole('heading', { level: 2 });
    await expect.element(headings).toHaveLength(3);
    await expect.element(headings.nth(0)).toHaveTextContent('Burger');
    await expect.element(headings.nth(1)).toHaveTextContent('Salad');
    await expect.element(headings.nth(2)).toHaveTextContent('Beer');
  });

  it('filters recipes by keywords', async () => {
    setUpAndMountRecipeSearch();

    await page.getByPlaceholder('Search recipes').fill('bur');
    const heading = page
      .getByRole('listitem')
      .getByRole('heading', { level: 2 });
    await expect.element(heading).toHaveTextContent('Burger');
  });
});

function setUpAndMountRecipeSearch() {
  const fake = new RecipeRepositoryFake();

  fake.configure({
    recipes: [
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Beer').build(),
    ],
  });

  singletonTesting.override(recipeRepositorySingleton, fake);
  onTestFinished(() => {
    singletonTesting.reset(recipeRepositorySingleton);
  });

  mount(RecipeSearch);
}
