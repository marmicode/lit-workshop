---
sidebar_label: 101. Display Recipes
---

# Display Recipes

## Prerequisites

🚨 Did you set up `pnpm`?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 101-display-recipes
pnpm start
```

## 🎯 Goal: Display a list of recipes

The `RecipeSearch` component currently shows a simple greeting message. Your goal is to display the list of recipes that are already stored in the `_recipes` property.

### 📝 Steps

#### 1. Update the `render()` method in `src/app/recipe-search.ts`

Replace the greeting message with a recipe list.

#### 2. Display the recipes as a list

Use the `map()` method to iterate through `this._recipes` and render each recipe.

**Key points:**

- Display the recipe image using `recipe.pictureUri`
- Show the recipe name
- Show the recipe description
- List all ingredients with their quantities

**Template example for iteration:**

```ts
${this._recipes.map(
  (recipe) => html`
    <li class="recipe">
      <!-- Recipe content here -->
    </li>
  `
)}
```

## 📖 Appendices

### Lit Documentation

- [Templates](https://lit.dev/docs/templates/overview/)
- [Lists](https://lit.dev/docs/templates/lists/)
- [Conditionals](https://lit.dev/docs/templates/conditionals/)
- [Styling](https://lit.dev/docs/components/styles/)

### Key Concepts

**Rendering lists in Lit:**

```ts
${items.map((item) => html`<div>${item.name}</div>`)}
```

**Conditional rendering:**

```ts
${when(user, (user) => html`<span>${user.name}</span>`)}
```
