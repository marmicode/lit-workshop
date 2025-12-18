---
sidebar_label: 502. Signals
---

# Signals

## Setup

```sh
pnpm cook start 502-signals
pnpm start
```

## 🎯 Goal: Replace RxJS with Lit **VERY EXPERIMENTAL** Signals API for reactive state management

Your goal is to refactor the meal planner to use Lit's experimental Signals API instead of RxJS. Signals provide a simpler, more lightweight approach to reactive state management.

### 📝 Steps

#### 1. Update `MealPlanner` to use signals in `src/app/meal-planner.ts`

Replace the `BehaviorSubject` with `signal` and `computed`:

```ts
import { computed, signal } from '@lit-labs/signals';

export class MealPlanner {
  private _recipes = signal<Recipe[]>([]);

  recipes = computed(() => /* TODO */ );

  addRecipe(recipe: Recipe) {
    // TODO
  }
}
```

**Key points:**

- `signal()` creates a reactive value container
- `computed()` creates a derived signal that auto-updates
- Use `.get()` to read and `.set()` to write signal values
- Remove the global singleton export: `export const mealPlanner = ...`

#### 2. Update `MealPlan` to use `SignalWatcher` in `src/app/meal-plan.ts`

Replace `RxSubscribeController` with the `SignalWatcher` mixin:

```ts
import { SignalWatcher } from '@lit-labs/signals';

@customElement('wm-meal-plan')
export class MealPlan extends SignalWatcher(LitElement) {}
```

#### 3. Update the `render()` method in `MealPlan` to use the signal's value

## 📖 Appendices

### Documentation

- [Lit Labs Signals](https://lit.dev/docs/data/signals/)
- [TC39 Signals Proposal](https://github.com/tc39/proposal-signals)

### Key Concepts

**Signals vs RxJS:**

| RxJS                 | Signals                        |
| -------------------- | ------------------------------ |
| `BehaviorSubject<T>` | `signal<T>()`                  |
| `.value`             | `.get()`                       |
| `.next()`            | `.set()`                       |
| `.subscribe()`       | Automatic with `SignalWatcher` |

**signal():**

- Creates a reactive primitive value
- Synchronous read/write access
- No subscription management needed

```ts
const count = signal(0);
count.get(); // 0
count.set(1);
count.get(); // 1
```

**computed():**

- Creates a derived value that auto-updates when dependencies change
- Read-only - cannot be set directly
- Lazy evaluation - only computes when accessed

```ts
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = computed(() => `${firstName.get()} ${lastName.get()}`);

fullName.get(); // "John Doe"
firstName.set('Jane');
fullName.get(); // "Jane Doe"
```

**SignalWatcher mixin:**

- Automatically re-renders component when accessed signals change
- Must extend `SignalWatcher(LitElement)` instead of just `LitElement`
- Any signal accessed in `render()` will trigger updates

```ts
@customElement('my-component')
export class MyComponent extends SignalWatcher(LitElement) {
  private count = signal(0);

  render() {
    // Component re-renders when count changes
    return html`<div>${this.count.get()}</div>`;
  }
}
```
