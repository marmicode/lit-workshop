import { css, html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

@customElement('wm-recipe-filter')
export class RecipeFilter extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .search-form {
      display: flex;
      max-width: 400px;
      margin: 1rem auto;

      input {
        flex: 1;
        border: 1px solid #ccc;
        border-radius: 8px 0 0 8px;
        font-size: 1rem;
        padding: 0.5rem 1rem;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
          background: #fff;
        }
      }

      button {
        border: 1px solid #ccc;
        border-left: none;
        border-radius: 0 8px 8px 0;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:hover {
          border-color: #999;
        }
      }
    }
  `;

  @query('input[name="keywords"]')
  private _searchInput?: HTMLInputElement;

  protected override render() {
    return html`
      <form
        class="search-form"
        @input=${() => this._updateKeywords()}
        @submit=${(event: SubmitEvent) => {
          event.preventDefault();
          this._updateKeywords();
        }}
      >
        <input name="keywords" placeholder="Search recipes" type="text" />
        <button type="submit">🔍</button>
      </form>
    `;
  }

  private _updateKeywords() {
    const keywords = this._searchInput?.value;
    this.dispatchEvent(new RecipeFilterChange({ keywords }));
  }
}

export class RecipeFilterChange extends Event {
  keywords?: string;
  constructor({ keywords }: { keywords?: string }) {
    super('recipe-filter-change');
    this.keywords = keywords;
  }
}
