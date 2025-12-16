---
sidebar_label: 403. Cancel Requests
---

# Cancel Requests

## Setup

```sh
pnpm cook start 403-cancel-request
pnpm start
```

## 🎯 Goal: Cancel in-flight requests to prevent race conditions

When users type quickly in the search box, multiple requests can be triggered. Your goal is to cancel previous requests when a new one starts, ensuring only the latest request's results are displayed. This prevents race conditions where old results arrive after new ones.

We will use [AbortController (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to cancel the request. It is an API that allows us to abort anything that can be aborted, such as a `fetch` requests:

```ts
const controller = new AbortController();
const signal = controller.signal;
fetch(url, { signal });
controller.abort(); // Aborts the request.
```

### 📝 Steps

#### 1. Add `AbortController` property

Add a property to track the current request's `AbortController`:

```ts
private _abortController?: AbortController;
```

#### 2. Forward the `AbortController.signal` to the `fetch` call through `RecipeRepository.searchRecipes`

```ts
async searchRecipes(
  filterCriteria: RecipeFilterCriteria = {},
  { signal }: { signal?: AbortSignal } = {}
): Promise<Recipe[]> {

}
```

#### 3. Update `_fetchRecipes` method

1. Abort any existing request using the `AbortController.abort` method.
2. Create a new `AbortController` and pass its signal to the repository.

#### 4. Now, what about when the component is destroyed?

## 📖 Appendices

### MDN Documentation

- [AbortController (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [AbortSignal (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
- [Fetch with AbortSignal (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#canceling_a_request)
