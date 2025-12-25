import { html, LitElement, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { format } from "date-fns";
import "./spinner";

@customElement("vt-time-table-header")
export class TimeTableHeader extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      padding: 0.25rem 0rem;
      z-index: 100;

      display: grid;
      grid-column: 1 / span 8;
      grid-template-columns: repeat(8, 1fr);
      place-items: center;

      font-size: 0.75rem;
      line-height: 1rem;
      font-weight: 400;
      text-align: center;
    }

    div {
      width: 100%;
      grid-column: span 1;
      text-align: center;
    }

    .time-table-direction {
      grid-column: span 4;
      text-align: left;
    }
  `;

  render() {
    return html`
      <div>Linje</div>
      <div>Läge</div>
      <div class="time-table-direction">Riktning</div>
      <div>Nästa</div>
      <div>Därefter</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vt-time-table-header": TimeTableHeader;
  }
}
