import { computed, signal } from '@lit-labs/signals';
import { Recipe } from './recipe';

export class MealPlanner {
  private _recipes = signal<Recipe[]>([]);

  recipes = computed(() => this._recipes.get());

  addRecipe(recipe: Recipe) {
    this._recipes.set([...this._recipes.get(), recipe]);
  }
}

export const mealPlanner = new MealPlanner();
