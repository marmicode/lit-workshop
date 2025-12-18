---
sidebar_label: 501. Meal Plan with RxJS
---

# Meal Plan with RxJS

## Setup

```sh
pnpm cook start 501-meal-plan
pnpm start
```

## 🎯 Goal: Implement a reactive meal planner using RxJS

Your goal is to implement a meal planner that allows users to add recipes from the search results. The meal planner uses RxJS to reactively track recipes and display them in a sidebar drawer.

### 📝 Steps

#### 1. Update the `RecipeSearch` component to add a recipe to the meal planner

#### 2. Implement `MealPlanner.addRecipe()` in `src/app/meal-planner.ts`

Use a `BehaviorSubject` to store and expose the list of recipes:

```ts
import { BehaviorSubject } from 'rxjs';

...
private _recipes$ = new BehaviorSubject<Recipe[]>([]);

```

**Key points:**

- `BehaviorSubject` stores the current value and emits it to new subscribers
- `asObservable()` exposes a read-only stream
- Spread the existing recipes to create an immutable update `this._recipes$.next([...this._recipes$.value, recipe])`

#### 3. Subscribe to `recipes$` in `MealPlan` using `RxSubscribeController`

In `src/app/meal-plan.ts`, use the provided `RxSubscribeController` to subscribe to the meal planner's recipe stream:

```ts
import { RxSubscribeController } from './rx-subscribe.controller';

private _recipes = new RxSubscribeController(
  this,
  () => myObservable$
);
```

#### 4. Update the `render()` method in `MealPlan` to display the recipes using the `<wm-recipe-preview>` component.

## 📖 Appendices

### Documentation

- [RxJS BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject)
- [Reactive Controllers (Lit)](https://lit.dev/docs/composition/controllers/)

### Key Concepts

**BehaviorSubject:**

- A special type of Subject that requires an initial value
- Always emits the current value to new subscribers
- Use `.value` to access the current value synchronously
- Use `.next()` to emit a new value

```ts
const subject = new BehaviorSubject<number[]>([]);
subject.next([1, 2, 3]); // Emit new value
console.log(subject.value); // [1, 2, 3]
```

**RxSubscribeController:**

- A custom Reactive Controller that subscribes to an Observable
- Automatically triggers component updates when values change
- Handles subscription cleanup when component disconnects

```ts
private _data = new RxSubscribeController(
  this,
  () => myService.data$
);

// Access the value in render()
render() {
  return html`${this._data.value}`;
}
```
