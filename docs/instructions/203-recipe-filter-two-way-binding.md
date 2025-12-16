---
sidebar_label: 203. Two-Way Binding
---

# Two-Way Binding

## Setup

```sh
pnpm cook start 203-recipe-filter-two-way-binding
```

## 🎯 Goal: Implement two-way data binding between parent and child

Currently, the `RecipeFilter` component only sends data up to its parent via events (one-way communication). Your goal is to also accept criteria from the parent, allowing the parent to control the filter values, enabling true two-way binding.

### 📝 Steps

#### 1. Add a criteria property to RecipeFilter

In `recipe-filter.ts`, add a property to accept criteria from the parent:

```ts
@property()
criteria?: RecipeFilterCriteria;
```

#### 2. Bind the criteria to input values

```html
<input .value=${criteria?.keywords ?? ''} />
```

#### 3. Pass criteria from parent to child

In `recipe-search.ts`, update the `RecipeFilter` usage to pass the criteria property:

```ts
<wm-recipe-filter
  .criteria=${this._criteria}
  @criteria-change=${this._handleCriteriaChange}
></wm-recipe-filter>
```

## 📖 Appendices

### Lit Documentation

- [Properties](https://lit.dev/docs/components/properties/)
- [Two-Way Binding](https://lit.dev/docs/templates/expressions/#two-way-binding)
- [Property Binding](https://lit.dev/docs/templates/expressions/#property-expressions)

### Key Concepts

**Two-Way Binding:**

- Parent passes data down via properties (`.prop=${value}`)
- Child sends data up via events (`@event=${handler}`)
- Together, they create a two-way data flow

**Property vs Attribute Binding:**

```ts
// Property binding - passes any JavaScript value
.value=${someValue}

// Attribute binding - converts to string
value=${someValue}
```

**Number to String Conversion:**

- Input elements expect string values
- Use `.toString()` to convert numbers
- Handle undefined/null with `??` operator:

```ts
.value=${myNumber?.toString() ?? ''}
```
