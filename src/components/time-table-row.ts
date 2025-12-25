import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Departure } from "../types";

@customElement("time-table-row")
export class TimeTableRow extends LitElement {
  @property({ type: Array })
  departureGroup!: Departure[];

  static styles = css`
    :host {
      width: 100%;
      height: 50px;

      grid-column: 1 / span 8;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
    }

    .line-badge {
      width: 100%;

      grid-column: span 1;
      display: grid;
      place-items: center;

      font-size: 1.75rem;
      font-weight: 600;
      letter-spacing: 0.025rem;

      box-sizing: border-box;
      border-style: solid;
      border-width: 0.25rem;
    }

    .platform {
      width: 100%;

      grid-column: span 1;
      display: grid;
      place-items: center;

      font-size: 1.25rem;
      line-height: 1.75;
      font-weight: 500;
    }

    .direction {
      width: 100%;

      grid-column: span 4;

      display: flex;
      align-items: center;
      justify-content: start;

      font-size: 1.125rem;
      line-height: normal;
      font-weight: 500;
    }

    .time-until-departure {
      width: 100%;

      grid-column: span 1;
      display: grid;
      place-items: center;

      font-size: 1.25rem;
      line-height: 1.75;
      font-weight: 600;
    }
  `;

  private _getMinutesUntilDeparture(departure?: Departure): number | string {
    if (!departure?.estimatedOtherwisePlannedTime) {
      return "-";
    }
    return Math.max(
      Math.round(
        (new Date(departure.estimatedOtherwisePlannedTime).getTime() - new Date().getTime()) /
          1000 /
          60
      ),
      0
    );
  }

  render() {
    const firstDeparture = this.departureGroup[0];
    const secondDeparture = this.departureGroup[1];

    return html`
      <div
        class="line-badge"
        style="background-color: ${firstDeparture.serviceJourney.line
          .backgroundColor}; color: ${firstDeparture.serviceJourney.line
          .foregroundColor}; border-color: ${firstDeparture.serviceJourney.line.borderColor}"
      >
        ${firstDeparture.serviceJourney.line.shortName}
      </div>
      <div class="platform">${firstDeparture.stopPoint.platform}</div>
      <div class="direction">
        ${firstDeparture.serviceJourney.direction.replace(/, påstigning fram$/i, "")}
      </div>
      <div class="time-until-departure">${this._getMinutesUntilDeparture(firstDeparture)}</div>
      <div class="time-until-departure">${this._getMinutesUntilDeparture(secondDeparture)}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "time-table-row": TimeTableRow;
  }
}
