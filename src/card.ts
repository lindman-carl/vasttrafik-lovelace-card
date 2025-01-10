import { html, LitElement, TemplateResult, nothing } from "lit";

import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";
import { state } from "lit/decorators.js";
import { styles } from "./card.styles";
import { HassEntity } from "home-assistant-js-websocket";

export interface Config extends LovelaceCardConfig {
  header: string;
  entity: string;
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class VasttrafikLovelaceCard extends LitElement {
  // internal reactive states
  @state()
  private _header!: string | typeof nothing;
  @state()
  private _entity!: string;
  @state()
  private _name!: string;
  @state()
  private _state!: HassEntity;
  @state()
  private _status!: string;

  // private property
  private _hass!: HomeAssistant;

  // lifecycle interface
  setConfig(config: Config) {
    this._header = config.header === "" ? nothing : config.header;
    this._entity = config.entity;
    // call set hass() to immediately adjust to a changed entity
    // while editing the entity in the card editor
    if (this._hass) {
      this.hass = this._hass;
    }
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this._state = hass.states[this._entity];
    if (this._state) {
      this._status = this._state.state;
      let fn = this._state.attributes.friendly_name;
      this._name = fn ? fn : this._entity;
    }
  }

  // declarative part
  static styles = styles;

  render() {
    return html`
      <ha-card>
        <div class="vasttrafik-card-content">
          <header class="header">
            <div class="stop-name">Sjupundsgatan, Göteborg</div>
            <div class="stop-name-timestamp">19:13</div>
            <div class="time-table-header">
              <div class="time-table-heading">Linje</div>
              <div class="time-table-heading">Läge</div>
              <div class="direction">Riktning</div>
              <div class="time-table-heading">Nästa</div>
              <div class="time-table-heading">Därefter</div>
            </div>
          </header>

          <div class="time-table">
            <li class="time-table-row">
              <div class="row-line-badge">19</div>
              <div class="row-platform">A</div>
              <div class="row-direction">Marklandsgatan</div>
              <div class="row-time-until-departure">5</div>
              <div class="row-time-until-departure">10</div>
            </li>
            <li class="time-table-row">
              <div class="row-line-badge">19</div>
              <div class="row-platform">A</div>
              <div class="row-direction">Marklandsgatan</div>
              <div class="row-time-until-departure">5</div>
              <div class="row-time-until-departure">10</div>
            </li>
            <li class="time-table-row">
              <div class="row-line-badge">19</div>
              <div class="row-platform">A</div>
              <div class="row-direction">Marklandsgatan</div>
              <div class="row-time-until-departure">5</div>
              <div class="row-time-until-departure">10</div>
            </li>
            <li class="time-table-row">
              <div class="row-line-badge">19</div>
              <div class="row-platform">A</div>
              <div class="row-direction">Marklandsgatan</div>
              <div class="row-time-until-departure">5</div>
              <div class="row-time-until-departure">10</div>
            </li>
            <li class="time-table-row">
              <div class="row-line-badge">19</div>
              <div class="row-platform">A</div>
              <div class="row-direction">Marklandsgatan</div>
              <div class="row-time-until-departure">5</div>
              <div class="row-time-until-departure">10</div>
            </li>
            <li class="time-table-row-last">...</li>
          </div>
        </div>
      </ha-card>
    `;
  }

  // event handling
  doToggle() {
    console.log("Toggle", this._entity);
    this._hass.callService("switch", "toggle", {
      entity_id: this._entity,
    });
  }

  // card configuration
  static getConfigElement() {
    return document.createElement("vasttrafik-lovelace-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "switch.on_off_plug_in_unit_2",
      header: "Vasttrafik Lovelace Card",
    };
  }
}
