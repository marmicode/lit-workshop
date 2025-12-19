import { BehaviorSubject } from 'rxjs';
import { type Recipe } from '@kitchen/core';
import { createSingleton } from '@kitchen/util';

export class MealPlanner {
  private _recipes$ = new BehaviorSubject<Recipe[]>([]);

  recipes$ = this._recipes$.asObservable();

  addRecipe(recipe: Recipe) {
    this._recipes$.next([...this._recipes$.value, recipe]);
  }
}

export const mealPlannerSingleton = createSingleton(() => new MealPlanner());
