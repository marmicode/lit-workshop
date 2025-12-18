---
sidebar_label: 601. Context
---

# Context

## Setup

```sh
pnpm cook start 601-context
pnpm start
```

## 🎯 Goal: Use Lit Context

Your goal is to replace the global singleton pattern with Lit Context. Context provides a way to share data between components without prop drilling, while also making the code more testable and flexible.

### 📝 Steps

#### 1. Create the context in `src/app/meal-planner.ts`

Add a context definition for the meal planner:

```ts
import { createContext } from '@lit/context';

export const MEAL_PLANNER_CONTEXT = createContext<MealPlanner>(
  Symbol('meal-planner')
);
```

**Key points:**

- `createContext()` creates a typed context key
- Use `Symbol()` for a unique identifier to avoid collisions
- Remove the global singleton export: `export const mealPlanner = ...`

#### 2. Provide the context in `RecipeSearch`

In `src/app/recipe-search.ts`, use `ContextProvider` to provide the meal planner:

```ts
import { ContextProvider } from '@lit/context';
import { MEAL_PLANNER_CONTEXT, MealPlanner } from './meal-planner';

private _mealPlanner = new ContextProvider(this, {
  context: MEAL_PLANNER_CONTEXT,
  initialValue: new MealPlanner(),
}).value;
```

**Key points:**

- `ContextProvider` makes the value available to all descendants
- Access `.value` to use the meal planner instance locally
- Remove the `mealPlanner` singleton import

#### 3. Consume the context in `MealPlan`

In `src/app/meal-plan.ts`, use the `@consume` decorator to receive the context:

```ts
import { consume } from '@lit/context';
import { MEAL_PLANNER_CONTEXT, MealPlanner } from './meal-planner';

@consume({ context: MEAL_PLANNER_CONTEXT })
private _mealPlanner?: MealPlanner;
```

#### 4. Handle the nullable context value

Since the context may not be provided, add a helper to assert the value:

```ts
// In src/app/util.ts
export function assertNonNullable<T>(
  value: T,
  message: string
): NonNullable<T> {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
```

Then use it in `MealPlan`:

```ts
import { assertNonNullable } from './util';

private _recipes = new RxSubscribeController(
  this,
  () =>
    assertNonNullable(this._mealPlanner, 'MealPlanner not provided').recipes$
);
```

## 📖 Appendices

### Documentation

- [Context (Lit)](https://lit.dev/docs/data/context/)
- [@lit/context Package](https://www.npmjs.com/package/@lit/context)

### Key Concepts

**createContext():**

- Creates a unique context key
- Type-safe - the value type is checked at compile time
- Use Symbol for unique identification

```ts
const MY_CONTEXT = createContext<MyService>(Symbol('my-service'));
```

**ContextProvider:**

- Makes a value available to all descendant components
- Can be created as a class property or in `connectedCallback()`
- Value can be updated at runtime

```ts
private _provider = new ContextProvider(this, {
  context: MY_CONTEXT,
  initialValue: new MyService(),
});

// Update value later
this._provider.setValue(newValue);
```

**@consume decorator:**

- Receives the context value from an ancestor provider
- Value is `undefined` if no provider exists
- Use `subscribe: true` to react to value changes

```ts
@consume({ context: MY_CONTEXT })
private _service?: MyService;

// With subscription (re-renders when value changes)
@consume({ context: MY_CONTEXT, subscribe: true })
private _service?: MyService;
```

**Context vs Props:**

Context is ideal for:

- Services and state that many components need
- Avoiding prop drilling through intermediate components
- Dependency injection for testing

Props are better for:

- Data specific to a component's purpose
- Clear parent-child data flow
- Simple component APIs
