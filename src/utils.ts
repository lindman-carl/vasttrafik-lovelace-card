import { compareAsc } from "date-fns";
import { Departure, GroupedDepartures } from "./types";

export const groupDepartures = (departures: Departure[]): GroupedDepartures => {
  const grouped: GroupedDepartures = {};

  departures.forEach((departure) => {
    if (!departure?.serviceJourney?.line) return;

    const key = `${departure.serviceJourney.line.shortName}:${
      departure.stopPoint?.platform
    }:${departure.serviceJourney.direction.replace(/, påstigning fram$/i, "")}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(departure);
  });

  return grouped;
};

export const sortDepartures = (groupedDepartures: GroupedDepartures): Departure[][] => {
  // Sort departures within each group
  Object.keys(groupedDepartures).forEach((key) => {
    groupedDepartures[key].sort((a, b) => {
      const aTime = new Date(a.estimatedOtherwisePlannedTime ?? Number.MAX_VALUE);
      const bTime = new Date(b.estimatedOtherwisePlannedTime ?? Number.MAX_VALUE);
      return compareAsc(aTime, bTime);
    });
  });

  // Sort groups by first departure time
  return Object.values(groupedDepartures).sort((a, b) => {
    const aTime = new Date(a[0].estimatedOtherwisePlannedTime ?? Number.MAX_VALUE);
    const bTime = new Date(b[0].estimatedOtherwisePlannedTime ?? Number.MAX_VALUE);
    return compareAsc(aTime, bTime);
  });
};
