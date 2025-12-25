import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Departure } from "../types";
import "./time-table-row";

@customElement("vt-time-table")
export class TimeTable extends LitElement {
  @property({ attribute: false })
  groupedDepartures: Departure[][] = [];

  @property({ type: Number })
  height: number = 250;

  static styles = css`
    :host {
      width: 100%;

      overflow-y: auto;

      margin: 0;
      padding: 0;

      display: grid;
      grid-column: span 8;
      grid-template-columns: repeat(8, 1fr);
      grid-auto-rows: 50px;
      row-gap: 4px;
      place-items: center;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .footer {
      width: 100%;
      height: 100px;

      grid-column: 1 / span 8;
      display: grid;
      place-items: center;
    }
  `;

  render() {
    return html`
      <style>
        :host {
          height: ${this.height}px;
        }
      </style>
      ${this.groupedDepartures.length > 0
        ? this.groupedDepartures.map(
            (departureGroup) => html`
              <time-table-row
                .departureGroup=${departureGroup}
                @click=${() => console.log("Clicked departure", departureGroup[0])}
              ></time-table-row>
            `
          )
        : null}
      <li class="footer">...</li>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vt-time-table": TimeTable;
  }
}
