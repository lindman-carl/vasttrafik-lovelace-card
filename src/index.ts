import { VasttrafikLovelaceCard } from "./card.ts";
import { VasttrafikLovelaceCardEditor } from "./editor.ts";

declare global {
  interface Window {
    customCards: Array<Object>;
  }
}

customElements.define("vasttrafik-lovelace-card", VasttrafikLovelaceCard);
customElements.define("vasttrafik-lovelace-card-editor", VasttrafikLovelaceCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "vasttrafik-lovelace-card",
  name: "Västtrafik Lovelace card",
  description: "Vässtrafik time tables card for Home Assistant dashboards",
});
