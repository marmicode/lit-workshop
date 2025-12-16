---
sidebar_label: 404. Task Controller
---

# Task Controller

## Setup

```sh
pnpm cook start 404-task
pnpm start
```

## 🎯 Goal: Simplify async operations with Lit's Task controller

The current implementation manually manages loading states, errors, and request cancellation. Your goal is to replace this with Lit's `Task` controller, which automatically handles all these concerns in a cleaner, more declarative way.

### 📝 Steps

#### 1. `Task` lives in a dedicated package `@lit/task` which is already installed in the workspace. Import it:

```ts
import { Task } from '@lit/task';
```

#### 2. Create a `Task`

Add a `Task` controller to handle recipe fetching:

```ts
private _task = new Task(this, {
  args: () => [this._criteria],
  task: ([criteria], { signal }) =>
    recipeRepository.searchRecipes(criteria, { signal }),
});
```

:::warning
The `_task` property does not need to be reactive. The `Task` controller will handle the reactive updates for us.
:::

**Key points:**

- `args` function returns an array of dependencies
- Task re-runs when any dependency changes
- `task` function receives args and options (including an abort signal)
- Signal is automatically managed for request cancellation

#### 3. Update render method

Replace the manual conditional rendering with `task.render()`:

```ts
${this._task.render({
  pending: () => html`<div class="loading">Loading...</div>`,
  complete: (recipes) => html`...`,
  error: () => html`...`,
})}
```

**Key points:**

- `pending()` renders while task is running
- `complete(value)` receives the resolved value
- `error(error)` receives any errors (though we don't use it here)
- Task automatically shows the right state

#### 4. Remove manual state management

Delete these properties:

```ts
@state() private _error?: unknown;
@state() private _recipes: Recipe[] = [];
private _abortController?: AbortController;
```

#### 5. Remove lifecycle methods

Delete these methods:

- `connectedCallback()`
- `willUpdate()`

The task automatically runs when args change.

#### 6. Allow user to manually retry on submit

```ts
private async _fetchRecipes() {
  await this._task.run();
}
```

## 📖 Appendices

### Lit Documentation

- [Task Controller](https://lit.dev/docs/data/task/)
- [Reactive Controllers](https://lit.dev/docs/composition/controllers/)

### Key Concepts

**Task Benefits:**

- Automatic loading/error state management
- Built-in request cancellation
- Automatic re-running on dependency changes
- Cleaner, more declarative code
- Less boilerplate

**Task Lifecycle:**

1. Component initializes
2. Args function runs
3. If args changed, task runs
4. Task sets state to "pending"
5. Task function executes
6. On success: state = "complete", stores value
7. On error: state = "error", stores error
8. Component renders appropriate state

**Args Function:**

```ts
args: () => [this._criteria];
```

- Returns array of values to track
- Task re-runs when any value changes
- Uses `Object.is()` for comparison
- Can return empty array for manual control

**Task Function:**

```ts
task: ([criteria], { signal }) => {
  return fetch(url, { signal });
};
```

- Receives destructured args
- Receives options object with `signal`
- Return a Promise
- Use signal for cancellation

**Task States:**

- `INITIAL`: Not yet run (only happens when `autoRun` is `false`)
- `PENDING`: Currently running
- `COMPLETE`: Successfully completed
- `ERROR`: Failed with error

**Render Callbacks:**
All callbacks are optional:

```ts
task.render({
  initial: () => html`...`, // Before first run
  pending: () => html`...`, // While running
  complete: (value) => html`...`, // Success
  error: (error) => html`...`, // Error
});
```

**Manual Task Control:**

```ts
// Run the task
await this._task.run();

// Run with specific args
await this._task.run(['new-value']);

// Check task status
if (this._task.status === TaskStatus.COMPLETE) {
  const value = this._task.value;
}

// Get error
if (this._task.status === TaskStatus.ERROR) {
  const error = this._task.error;
}
```
