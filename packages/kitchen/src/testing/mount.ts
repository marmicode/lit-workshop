import { LitElement } from 'lit';
import { onTestFinished } from 'vitest';

export function mount<T extends new () => LitElement>(component: T) {
  const tag = customElements.getName(component);

  if (!tag) {
    throw new Error(`Component ${component.name} is not registered`);
  }

  const element = document.createElement(tag);

  document.body.appendChild(element);
  onTestFinished(() => {
    document.body.removeChild(element);
  });

  return element;
}
