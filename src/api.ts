import { Departure, StopArea } from "./types";
import { tokenManager } from "./token-manager";
import { groupDepartures, sortDepartures } from "./utils";

const BASE_URL = "https://ext-api.vasttrafik.se/pr/v4";

interface LocationResult {
  gid?: string | null;
  name: string;
  locationType: string;
}

interface LocationsResponse {
  results?: LocationResult[] | null;
}

interface DeparturesResponse {
  results?: Departure[];
}

export class VasttrafikApi {
  setCredentials(clientId: string, clientSecret: string): void {
    tokenManager.setCredentials(clientId, clientSecret);
  }

  private async fetchWithAuth<T>(url: string): Promise<T> {
    const token = await tokenManager.getBearerToken();
    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Resolves a stop area name to its GID using the Locations API.
   * Returns the GID of the first stop area match, or null if not found.
   */
  async resolveStopAreaGid(stopName: string): Promise<string | null> {
    const params = new URLSearchParams({
      q: stopName,
      types: "stoparea",
      limit: "1",
    });

    const response = await this.fetchWithAuth<LocationsResponse>(
      `${BASE_URL}/locations/by-text?${params}`
    );

    const firstResult = response.results?.[0];
    if (firstResult?.gid) {
      return firstResult.gid;
    }

    return null;
  }

  async fetchStopArea(options: {
    gid?: string;
    stopName?: string;
    limit: number;
  }): Promise<StopArea> {
    // Resolve the GID: use gid if provided, otherwise resolve from stopName
    let stopAreaGid: string | null = options.gid || null;

    if (!stopAreaGid && options.stopName) {
      stopAreaGid = await this.resolveStopAreaGid(options.stopName);
    }

    if (!stopAreaGid) {
      throw new Error(
        "Could not determine stop area GID. Please provide a valid GID or stop name."
      );
    }

    const params = new URLSearchParams({
      limit: String(options.limit),
      maxDeparturesPerLineAndDirection: "2",
    });

    const stopArea = await this.fetchWithAuth<DeparturesResponse>(
      `${BASE_URL}/stop-areas/${encodeURIComponent(stopAreaGid)}/departures?${params}`
    );

    const departures = stopArea.results ?? [];
    const groupedDepartures = groupDepartures(departures);
    const sortedDepartures = sortDepartures(groupedDepartures);

    const stopAreaName = departures[0]?.stopPoint?.name || "-";

    return {
      name: stopAreaName,
      gid: stopAreaGid,
      departures: departures,
      groupedDepartures: sortedDepartures,
    };
  }
}

export const vasttrafikApi = new VasttrafikApi();
