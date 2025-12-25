import type { LovelaceCardConfig } from "custom-card-helpers";

export interface VasttrafikCardConfig extends LovelaceCardConfig {
  gid?: string;
  stop_name?: string;
  client_id: string;
  client_secret: string;
  time_table_height?: number;
  limit?: number;
  refresh_interval?: number;
}

export interface ResolvedCardConfig extends LovelaceCardConfig {
  gid?: string;
  stop_name?: string;
  client_id: string;
  client_secret: string;
  time_table_height: number;
  limit: number;
  refresh_interval: number;
}

export const DEFAULT_CONFIG: ResolvedCardConfig = {
  type: "custom:vasttrafik-lovelace-card",
  gid: undefined,
  stop_name: "Brunnsparken, Göteborg",
  client_id: "",
  client_secret: "",
  time_table_height: 250,
  limit: 50,
  refresh_interval: 60,
};

const env = import.meta.env;
const isDev = import.meta.env.DEV;

export const resolveConfig = (config?: VasttrafikCardConfig): ResolvedCardConfig => {
  if (isDev) {
    return {
      ...DEFAULT_CONFIG,
      gid: env.VITE_VASTTRAFIK_GID ?? DEFAULT_CONFIG.gid,
      stop_name: env.VITE_VASTTRAFIK_STOP_NAME ?? DEFAULT_CONFIG.stop_name,
      client_id: env.VITE_VASTTRAFIK_CLIENT_ID ?? DEFAULT_CONFIG.client_id,
      client_secret: env.VITE_VASTTRAFIK_CLIENT_SECRET ?? DEFAULT_CONFIG.client_secret,
    };
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
};
