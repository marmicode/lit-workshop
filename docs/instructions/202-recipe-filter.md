---
sidebar_label: 202. Recipe Filter Component
---

# Recipe Filter Component

## Setup

```sh
pnpm cook start 202-recipe-filter
pnpm start
```

## 🎯 Goal: Extract filtering logic into a separate component with custom events

The search form is currently embedded in `RecipeSearch`. Your goal is to extract it into a separate `RecipeFilter` component that communicates with its parent using custom events, and **add support for filtering by maximum ingredients and steps**.

### 📝 Steps

#### 1. Create `RecipeFilter` component in `src/app/recipe-filter.ts`.

#### 2. Define types and interfaces

At the bottom of `recipe-filter.ts`, define:

```ts
export class RecipeFilterCriteriaChange extends Event {
  criteria: RecipeFilterCriteria;
  constructor(criteria: RecipeFilterCriteria) {
    super('criteria-change');
    this.criteria = criteria;
  }
}

export class RecipeFilterCriteriaSubmit extends Event {
  criteria: RecipeFilterCriteria;
  constructor(criteria: RecipeFilterCriteria) {
    super('criteria-submit');
    this.criteria = criteria;
  }
}

export interface RecipeFilterCriteria {
  keywords?: string;
  maxIngredients?: number;
  maxSteps?: number;
}

export function createRecipeFilterCriteria(
  criteria: RecipeFilterCriteria
): RecipeFilterCriteria {
  return criteria;
}
```

#### 3. Dispatch custom events when appropriate

```ts
// on input
this.dispatchEvent(new RecipeFilterCriteriaChange(...));

// on submit
this.dispatchEvent(new RecipeFilterCriteriaSubmit(...));
```

#### 4. Update `RecipeSearch` to use `RecipeFilter`

## 📖 Appendices

### Lit Documentation

- [Events](https://lit.dev/docs/components/events/)

### Key Concepts

**Custom Events:**

- Extend the `Event` class to create custom events
- Pass data by adding properties to your custom event class
- Use meaningful event names (kebab-case convention)

**Dispatching Events:**

```ts
this.dispatchEvent(new MyCustomEvent(data));
```

**Listening to Custom Events:**

```html
<my-element @my-event="${this._handleMyEvent}"></my-element>
```

**Event Handler:**

```ts
private _handleMyEvent(event: MyCustomEvent) {
  const data = event.data;
}
```

**valueAsNumber:**

- HTML input elements have a `valueAsNumber` property
- Returns a number for numeric inputs
- Returns `NaN` if the input is empty or not a valid number
