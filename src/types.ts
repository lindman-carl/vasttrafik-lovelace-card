import { type LovelaceCard, type LovelaceCardConfig } from "custom-card-helpers";

declare global {
  interface HTMLElementTagNameMap {
    "hui-error-card": LovelaceCard;
  }
}

export interface Line {
  name: string;
  shortName: string;
  backgroundColor: string;
  foregroundColor: string;
  borderColor: string;
  transportMode: string;
}

export interface ServiceJourney {
  direction: string;
  line: Line;
}

export interface StopPoint {
  name: string;
  platform: string;
}

export interface Departure {
  detailsReference: string;
  serviceJourney: ServiceJourney;
  stopPoint: StopPoint;
  plannedTime?: string;
  estimatedTime?: string;
  estimatedOtherwisePlannedTime?: string;
  isCancelled: boolean;
  isPartCancelled: boolean;
}

export interface GroupedDepartures {
  [key: string]: Departure[];
}

export interface StopArea {
  name: string;
  gid: string;
  departures: Departure[];
  groupedDepartures: Departure[][];
}
