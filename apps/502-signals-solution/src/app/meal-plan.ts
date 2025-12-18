import { SignalWatcher } from '@lit-labs/signals';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { mealPlanner } from './meal-planner';
import './recipe-preview';

@customElement('wm-meal-plan')
export class MealPlan extends SignalWatcher(LitElement) {
  static override styles = css`
    .empty-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-color-secondary);
      text-align: center;
      padding: 2rem;
    }

    .empty-message-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-message-text {
      font-size: 1.1rem;
    }
  `;

  private _mealPlanner = mealPlanner;

  protected override render() {
    const recipes = this._mealPlanner.recipes.get();
    const hasRecipes = recipes && recipes.length > 0;
    return when(
      hasRecipes,
      () => html`
        <ul>
          ${recipes?.map(
            (recipe) => html`
              <wm-recipe-preview
                mode="compact"
                .recipe=${recipe}
              ></wm-recipe-preview>
            `
          )}
        </ul>
      `,
      () => html`
        <div class="empty-message">
          <div class="empty-message-icon">🍽️</div>
          <div class="empty-message-text">
            Your meal plan is empty.<br />
            Add recipes to get started!
          </div>
        </div>
      `
    );
  }
}
