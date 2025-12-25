import { html, LitElement, css, type TemplateResult } from "lit";

import { HomeAssistant } from "custom-card-helpers";
import { state } from "lit/decorators.js";
import { StopArea } from "./types";
import { vasttrafikApi } from "./api";
import { resolveConfig, ResolvedCardConfig, VasttrafikCardConfig } from "./config";
import "./components/header";
import "./components/time-table-header";
import "./components/time-table";
import "./components/spinner";
import { DEFAULT_CONFIG } from "./config";

declare global {
  interface Window {
    customCards: Array<Object>;
  }
}

export class VasttrafikCard extends LitElement {
  @state()
  private _config!: ResolvedCardConfig;
  @state()
  private _stopArea!: StopArea;
  @state()
  private _isLoading!: boolean;
  @state()
  private _lastUpdated!: Date;
  @state()
  private _error?: TemplateResult;

  private _hass!: HomeAssistant;
  private _refreshInterval?: ReturnType<typeof setInterval>;

  setConfig(config: VasttrafikCardConfig) {
    if (!config) {
      throw this.createError("Invalid configuration.");
    }

    if (!config.client_id) {
      throw this.createError('Attribute "client_id" must be present.');
    }

    if (!config.client_secret) {
      throw this.createError('Attribute "client_secret" must be present.');
    }

    if (!config.gid && !config.stop_name) {
      throw this.createError('Either "gid" or "stop_name" must be present.');
    }

    this._config = resolveConfig(config);
    vasttrafikApi.setCredentials(this._config.client_id, this._config.client_secret);

    this._fetchStopArea();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  static getStubConfig() {
    return DEFAULT_CONFIG;
  }

  async connectedCallback() {
    super.connectedCallback();

    this._config = resolveConfig(this._config);

    await this._fetchStopArea();

    this._refreshInterval = setInterval(
      () => this._fetchStopArea(),
      (this._config.refresh_interval ?? 60) * 1000
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = undefined;
    }
  }

  private async _fetchStopArea() {
    if (!this._config?.gid && !this._config?.stop_name) {
      return;
    }

    this._isLoading = true;

    try {
      const stopArea = await vasttrafikApi.fetchStopArea({
        gid: this._config.gid,
        stopName: this._config.stop_name,
        limit: this._config.limit ?? 50,
      });

      this._stopArea = stopArea;
      this._lastUpdated = new Date();
    } catch (error) {
      console.error("Error fetching stop area:", error);
    } finally {
      this._isLoading = false;
    }
  }

  private createError(errorString: string): Error {
    const error = new Error(errorString);
    const errorCard = document.createElement("hui-error-card");
    errorCard.setConfig({
      type: "error",
      error,
      origConfig: this._config,
    });
    this._error = html`${errorCard}`;
    return error;
  }

  static styles = css`
    ha-card {
      padding: 1rem;
    }

    .vasttrafik-card-content {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(8, auto);
      grid-template-rows: "auto 1fr";

      overflow: hidden;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      grid-column: 1 / -1;
    }
  `;

  render() {
    if (this._error) {
      return this._error;
    }

    return html`
      <ha-card>
        <div class="vasttrafik-card-content">
          ${!this._stopArea && this._isLoading
            ? html`<div class="spinner-container"><vt-spinner></vt-spinner></div>`
            : html`
                <vt-header
                  title="${this._stopArea?.name || ""}"
                  .isLoading=${this._isLoading}
                  .lastUpdated=${this._lastUpdated}
                ></vt-header>

                <vt-time-table-header></vt-time-table-header>

                <vt-time-table
                  .groupedDepartures=${this?._stopArea?.groupedDepartures ?? {}}
                  .height=${this._config.time_table_height}
                ></vt-time-table>
              `}
        </div>
      </ha-card>
    `;
  }
}

customElements.define("vasttrafik-lovelace-card", VasttrafikCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "vasttrafik-lovelace-card",
  name: "Västtrafik Lovelace card",
  description: "Display Västtrafik departures in a Home Assistant dashboard card.",
});

console.log("window.customCards:", JSON.stringify(window.customCards, null, 2));
