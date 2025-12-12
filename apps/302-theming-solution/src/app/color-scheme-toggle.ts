import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ColorScheme } from './color-scheme';

/**
 * @fires color-scheme-change - Emitted when the scheme changes
 *
 * @property {ColorScheme} colorScheme - The current color scheme
 */
@customElement('wm-color-scheme-toggle')
export class ColorSchemeToggle extends LitElement {
  static override styles = css`
    .toggle {
      position: relative;
      width: 60px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .toggle:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .toggle-slider {
      position: absolute;
      top: 0;
      left: 0;
      width: 28px;
      height: 28px;
      line-height: 30px;

      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease-in-out;

      &.dark {
        transform: translateX(28px);
      }
    }
  `;

  @property({ attribute: 'color-scheme' })
  colorScheme: ColorScheme = 'light';

  protected override render() {
    const dark = this.colorScheme === 'dark';
    const icon = dark ? '🌙' : '☀️';
    return html`<button class="toggle" @click=${this._toggleColorScheme}>
      <span class=${classMap({ 'toggle-slider': true, dark })}>${icon}</span>
    </button>`;
  }

  private _toggleColorScheme() {
    this.colorScheme = this.colorScheme === 'light' ? 'dark' : 'light';
    this.dispatchEvent(new ColorSchemeToggleChange(this.colorScheme));
  }
}

export class ColorSchemeToggleChange extends Event {
  colorScheme: ColorScheme;
  constructor(colorScheme: ColorScheme) {
    super('mode-change');
    this.colorScheme = colorScheme;
  }
}
