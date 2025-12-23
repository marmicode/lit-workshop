---
sidebar_label: 📋 Cheatsheet
sidebar_position: 0
---

# Lit Cheatsheet

### Setup with Nx

```sh
pnpm create nx-workspace my-lit-app --preset ts
cd my-lit-app

# Add Nx Web plugin (this will add the web app and lib generators, among other things)
pnpm nx add @nx/web

pnpm add -w lit
```

### Rendering

```ts
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  name = 'Marmicode';

  render() {
    return html`<div>Welcome to ${this.name}!</div>`;
  }
}
```

### Conditional Rendering

```ts
import { when } from 'lit/directives/when.js';

// In render():
${when(
  this.isLoggedIn,
  () => html`<span>Welcome, ${this.userName}!</span>`,
  () => html`<button>Login</button>`
)}
```

### `@state()` - Internal Reactive State

```ts
import { state } from 'lit/decorators.js';

@state()
private _count = 0;

// Changing _count triggers re-render
private _increment() {
  this._count++;
}
```

### `@query()` - DOM References

```ts
import { query } from 'lit/decorators.js';

@query('input[name="search"]')
private _searchInput?: HTMLInputElement;

// Access the DOM element
private _handleSubmit() {
  const value = this._searchInput?.value;
}
```

### `willUpdate()` Lifecycle

`willUpdate()` lifecycle hook is often used to derive values based on properties that have changed.

```ts
import { PropertyValues } from 'lit';

protected override willUpdate(changedProperties: PropertyValues): void {
  if (changedProperties.has('_keywords')) {
    this._filteredItems = this._items.filter(item => item.keywords.includes(this._keywords));
  }
}
```

### Event Handling

Event delegation (listening to events on a parent element and handling them in a child element) reduces the number of event listeners you need to add. It often leads to simpler code and better performance.

```ts
// Template
<form @input=${this._handleInput} @submit=${this._handleSubmit}>
  <input name="keywords" />
  <button type="submit">Search</button>
</form>

// Handlers
private _handleInput() {
  this._keywords = this._searchInput?.value;
}

private _handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  // ...
}
```

### `@property()` - External Properties

`@property()` decorator is used to declare external properties that are reactive.

The `type` parameter is used to specify how an attribute should be converted to a property.
This is mainly useful when custom elements are used in a static HTML page for example.

```ts
import { property } from 'lit/decorators.js';

@property({ type: Object })
recipe?: Recipe;

/* String is the default type. */
@property()
name = 'default';

@property({ type: Number })
count = 0;

@property({ type: Boolean })
disabled = false;
```

### Property vs Attribute Binding

```ts
// Property binding - passes any JavaScript value (objects, arrays, etc.)
<my-element .recipe=${recipeObject}></my-element>

// Attribute binding - converts to string
<my-element name=${stringValue}></my-element>

// Boolean attribute binding
<my-element ?disabled=${isDisabled}></my-element>
```

### Custom Events

Prefer subclassing `Event` to create custom events.

```ts
// Define custom event class
export class CriteriaChange extends Event {
  constructor(public criteria: FilterCriteria) {
    super('criteria-change');
  }
}

// Dispatch event
this.dispatchEvent(new CriteriaChange(this._criteria));

// Listen to event
<my-filter @criteria-change=${this._handleCriteriaChange}></my-filter>

// Handle event
private _handleCriteriaChange(event: CriteriaChange) {
  this._criteria = event.criteria;
}
```

### "Two-Way Binding" Pattern

```ts
// Parent component
<my-filter
  .criteria=${this._criteria}
  @criteria-change=${this._handleChange}
></my-filter>

// Child component - accept + emit
@property()
criteria?: FilterCriteria;

<input .value=${this.criteria?.keywords ?? ''} @input=${this._handleInput} />
```

### Protect component from CSS inheritance

```css
:host {
  all: initial;
}
```

### `classMap` Directive

```ts
import { classMap } from 'lit/directives/class-map.js';

<div class=${classMap({
  'card': true,
  'compact': this.mode === 'compact',
  'active': this.isActive
})}></div>
```

### CSS Parts

```ts
// Inside component - expose part
<h2 part="title">${this.title}</h2>;

// Outside component - style part
css`
  my-component::part(title) {
    color: purple;
    font-family: Cursive;
  }
`;
```

### CSS Custom Properties / Theming

```css
/* Define variables in global styles */
body {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background-color: light-dark(#eee, #333);
  --text-color: light-dark(#444, white);
}

/* Use in components - CSS vars pierce Shadow DOM */
background: linear-gradient(
  135deg,
  var(--primary-color) 0%,
  var(--secondary-color) 100%
);
color: var(--text-color);
```

### `light-dark()` Function

```css
/* Automatically adapts to color-scheme */
background: light-dark(white, #222);
color: light-dark(#333, #eee);
border-color: light-dark(#ccc, #555);
```

### Slots

```ts
// Define slot in child component
<div class="content">
  <slot></slot>                    <!-- Default slot -->
  <slot name="actions"></slot>     <!-- Named slot -->
</div>

// Use slot in parent
<my-card>
  <p>Default content</p>
  <button slot="actions">Add</button>
</my-card>
```

### Data Attributes Pattern

If listeners change between renders, they are removed and re-added, which can lead to performance issues.
Listeners should therefore always point to a stable function reference.

In order to pass data to a handler in a list, it is common to use data attributes.

```ts
// Pass data via attributes
<button data-recipe-id="${recipe.id}" @click=${this._handleClick}>
  Add
</button>

// Access in handler
private _handleClick(event: MouseEvent) {
  const recipeId = (event.target as HTMLButtonElement).dataset.recipeId;
}
```

### `connectedCallback()`

`connectedCallback()` is a lifecycle hook that is called when the component is added to the DOM.

Note that a component can be removed and added to the DOM multiple times.

```ts
override connectedCallback() {
  super.connectedCallback();  // Always call super first!
  this._fetchData();
}
```

### `Task` Controller

```ts
import { Task } from '@lit/task';

private _task = new Task(this, {
  args: () => [this._criteria],
  task: ([criteria], { signal }) =>
    repository.search(criteria, { signal }),
});

// In render()
${this._task.render({
  pending: () => html`<div>Loading...</div>`,
  complete: (data) => html`${this._renderData(data)}`,
  error: (error) => html`<div>Error: ${error.message}</div>`,
})}

// Manual run
private async _retry() {
  await this._task.run();
}
```

### State management with RxJS's `BehaviorSubject`

```ts
import { BehaviorSubject } from 'rxjs';

export class Store {
  private _items$ = new BehaviorSubject<Item[]>([]);

  items$ = this._items$.asObservable();

  addItem(item: Item) {
    this._items$.next([...this._items$.value, item]);
  }
}
```

### `RxSubscribeController`

```ts
import { RxSubscribeController } from './rx-subscribe.controller';

private _items = new RxSubscribeController(
  this,
  () => store.items$
);

// In render()
${this._items.value?.map((item) => html`...`)}
```

### `Lit Context`

```ts
import { createContext } from '@lit/context';
import { ContextProvider, consume } from '@lit/context';

// Create context
export const MY_CONTEXT = createContext<MyService>(Symbol('my-service'));

// Provide (in parent)
private _service = new ContextProvider(this, {
  context: MY_CONTEXT,
  initialValue: new MyService(),
}).value;

// Consume (in child)
@consume({ context: MY_CONTEXT })
private _service?: MyService;
```

### Testable Singleton

```ts
// singleton.ts
export function createSingleton<T>(factory: () => T) {
  let value: T | undefined;
  return {
    get: () => (value ??= factory()),
  };
}

// Usage
export const serviceSingleton = createSingleton(() => new MyService());

// In component
private _service = serviceSingleton.get();
```

### `repeat()` Directive

```ts
import { repeat } from 'lit/directives/repeat.js';

// Use for lists that reorder/filter
${repeat(
  this._items,
  (item) => item.id,  // Key function - must be unique
  (item) => html`<my-item .data=${item}></my-item>`
)}
```

### `cache()` Directive

```ts
import { cache } from 'lit/directives/cache.js';

// Preserves DOM when toggling visibility
${cache(
  when(this._isVisible, () => html`
    <expensive-component></expensive-component>
  `)
)}
```

### `repeat()` vs `map()`

| `map()`                       | `repeat()`             |
| ----------------------------- | ---------------------- |
| Might recreate DOM on reorder | Reuses & moves DOM     |
| No key function needed        | Requires key function  |
| Fast for static lists         | Fast for dynamic lists |
| O(n) DOM ops on reorder       | O(1) moves per item    |

## 📝 Quick Reference

### Decorators

| Decorator                    | Purpose                    |
| ---------------------------- | -------------------------- |
| `@customElement('tag-name')` | Register custom element    |
| `@property()`                | External reactive property |
| `@state()`                   | Internal reactive state    |
| `@query('selector')`         | DOM element reference      |

### Lifecycle Methods

| Method                     | When Called              |
| -------------------------- | ------------------------ |
| `connectedCallback()`      | Element added to DOM     |
| `disconnectedCallback()`   | Element removed from DOM |
| `willUpdate(changedProps)` | Before render            |
| `render()`                 | Render template          |
| `firstUpdated()`           | After first render       |
| `updated(changedProps)`    | After every render       |

### Directives

| Directive                     | Purpose                   |
| ----------------------------- | ------------------------- |
| `when(cond, thenFn, elseFn)`  | Conditional rendering     |
| `repeat(items, keyFn, tplFn)` | Efficient list rendering  |
| `cache(template)`             | Cache DOM across changes  |
| `classMap(obj)`               | Conditional CSS classes   |
| `styleMap(obj)`               | Conditional inline styles |

### Imports

```ts
// Core
import { html, css, LitElement } from 'lit';

// Decorators
import { customElement, property, state, query } from 'lit/decorators.js';

// Directives
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { cache } from 'lit/directives/cache.js';
import { classMap } from 'lit/directives/class-map.js';

// Task
import { Task } from '@lit/task';

// Context
import { createContext, ContextProvider, consume } from '@lit/context';

// Signals (experimental)
import { signal, computed } from '@lit-labs/signals';
import { SignalWatcher } from '@lit-labs/signals';
```

---

## 🔗 Resources

- [Lit Documentation](https://lit.dev/docs/)
- [Lit Playground](https://lit.dev/playground/)
- [Lit Labs](https://lit.dev/docs/libraries/labs/)
