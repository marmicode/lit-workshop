---
sidebar_label: 701. Performance Optimization
---

# Performance Optimization

## Setup

```sh
pnpm cook start 701-performance-optimization
pnpm start
```

## 🎯 Goal: Optimize rendering performance with Lit directives

Your goal is to optimize the recipe list rendering using Lit's built-in directives. The current implementation re-renders all items unnecessarily when toggling visibility or sorting. You'll use `repeat` and `cache` directives to minimize DOM operations.

### 📝 Steps

#### 1. Replace `map()` with `repeat()` for rendering recipes

In the `render()` method, replace the `recipes.map()` call with `repeat()`:

```ts
${repeat(
  recipes,
  (recipe) => recipe.id,
  (recipe) => html`<wm-recipe-preview ...>...</wm-recipe-preview>`
)}
```

**Key points:**

- The second argument is a **key function** that returns a unique identifier
- Lit uses keys to match existing DOM nodes with items, avoiding unnecessary re-creation
- When sorting changes, nodes are **moved** instead of **destroyed and recreated**

#### 2. Wrap conditional content with `cache()` directive

Wrap the `when()` directive with `cache()` to preserve DOM when hiding/showing:

```ts
${cache(
  when(this._showOptions === '🐵', () =>
    this._task.render({
      // ... existing render logic
    })
  )
)}
```

**Key points:**

- `cache()` caches and re-uses DOM across template changes
- When toggling visibility (🐵/🙈), the DOM is preserved instead of destroyed
- Re-showing the recipes is instant since the DOM is cached

## 📖 Appendices

### Documentation

- [repeat directive (Lit)](https://lit.dev/docs/templates/directives/#repeat)
- [cache directive (Lit)](https://lit.dev/docs/templates/directives/#cache)

### Key Concepts

**repeat() vs map():**

| `map()`                         | `repeat()`                    |
| ------------------------------- | ----------------------------- |
| Recreates DOM nodes on reorder  | Reuses and moves DOM nodes    |
| Simpler, no key function needed | Requires a key function       |
| Fast for static lists           | Fast for dynamic/sorted lists |
| O(n) DOM operations on reorder  | O(1) DOM moves per item       |

**When to use repeat():**

```ts
// Use repeat() when:
// - Items have stable unique IDs
// - List order changes frequently (sorting/filtering)
// - Items have expensive render costs

repeat(
  items,
  (item) => item.id, // Key function - must return unique identifier
  (item) => html`...` // Template function
);
```

**cache() directive:**

- Caches DOM nodes for conditional templates
- Useful for tabs, toggles, or show/hide patterns
- Trades memory for performance

```ts
// Without cache: DOM is destroyed/recreated on each toggle
when(condition, () => html`<expensive-component></expensive-component>`);

// With cache: DOM is preserved and reused
cache(when(condition, () => html`<expensive-component></expensive-component>`));
```

**Performance debugging:**

The starter includes timing code to measure render performance:

```ts
const measureName = '⏱️';
console.time(measureName);
this.updateComplete.then(() => console.timeEnd(measureName));
```

Use the selectors to test:

- **1x/200x**: Toggle list size
- **⬇️/⬆️**: Toggle sort direction
- **🐵/🙈**: Toggle visibility

Compare render times before and after your optimizations!
