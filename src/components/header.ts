import { html, LitElement, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { format } from "date-fns";
import "./spinner";

@customElement("vt-header")
export class Header extends LitElement {
  @property({ type: String })
  title!: string;

  @property({ type: Boolean })
  isLoading = false;

  @property({ attribute: false })
  lastUpdated?: Date;

  static styles = css`
    :host {
      width: 100%;

      display: grid;
      grid-column: span 8;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: 1fr auto;

      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: 600;
    }

    .title {
      width: 100%;
      height: 50px;

      grid-column: 1 / span 7;
      display: flex;
      align-items: center;
      justify-content: start;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .updated-timestamp {
      width: 100%;
      height: 50px;

      display: grid;
      place-items: center;

      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 500;
    }
  `;

  render() {
    return html`
      <div class="title">${this.title}</div>
      <div class="updated-timestamp">
        ${this.isLoading
          ? html`<vt-spinner></vt-spinner>`
          : this.lastUpdated
          ? format(this.lastUpdated, "HH:mm")
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vt-header": Header;
  }
}
