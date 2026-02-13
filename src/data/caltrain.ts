import scheduleData from "./caltrain-schedule.json";

export type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  order: number;
};

export type ServiceType = "weekday" | "weekend";

export type TripStop = {
  stationId: string;
  time: string; // HH:MM
};

export type Trip = {
  id: string;
  number: string;
  headsign: string;
  direction: number; // 0=NB, 1=SB
  routeName: string;
  routeColor: string;
  serviceType: ServiceType;
  stops: TripStop[];
};

// Parse stations
export const stations: Station[] = scheduleData.stations.map(
  (s: any, index: number) => ({
    id: s.id,
    name: s.n,
    lat: s.lat,
    lon: s.lon,
    order: index,
  })
);

const stationById = new Map(stations.map((s) => [s.id, s]));
const stationByIndex = new Map(stations.map((s, i) => [i, s]));

export function getStation(id: string): Station | undefined {
  return stationById.get(id);
}

// Parse trips
export const trips: Trip[] = scheduleData.trips.map((t: any) => ({
  id: t.id,
  number: t.n,
  headsign: t.h,
  direction: t.d,
  routeName: t.r,
  routeColor: t.c,
  serviceType: t.s === "w" ? "weekday" : "weekend",
  stops: t.st.map((st: any) => ({
    stationId: stationByIndex.get(st[0])?.id ?? "",
    time: st[1],
  })),
}));

// Get route display info
export function getRouteType(
  routeName: string
): "local" | "limited" | "express" | "south-county" {
  if (routeName.includes("Express")) return "express";
  if (routeName.includes("Limited")) return "limited";
  if (routeName.includes("South County")) return "south-county";
  return "local";
}

export function getRouteDisplayColor(routeName: string): string {
  switch (getRouteType(routeName)) {
    case "express":
      return "#ce202f";
    case "limited":
      return "#10A37F";
    case "south-county":
      return "#F5A623";
    default:
      return "#6B7280";
  }
}

export function getRouteLabel(routeName: string): string {
  const type = getRouteType(routeName);
  switch (type) {
    case "express":
      return "Express";
    case "limited":
      return "Limited";
    case "south-county":
      return "South County";
    default:
      return "Local";
  }
}

// Time utilities
function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time: string): string {
  const [hStr, m] = time.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export { formatTime, parseTime };

// Get current service type based on day of week
export function getCurrentServiceType(): ServiceType {
  const day = new Date().getDay();
  return day === 0 || day === 6 ? "weekend" : "weekday";
}

// Get current time in minutes since midnight (Pacific time)
function getCurrentMinutes(): number {
  const now = new Date();
  // Approximate PT offset
  const ptOffset = -7 * 60; // PDT
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  let ptMinutes = utcMinutes + ptOffset;
  if (ptMinutes < 0) ptMinutes += 1440;
  return ptMinutes;
}

// Get upcoming departures from a station
export function getDepartures(
  stationId: string,
  serviceType: ServiceType,
  direction?: number
): {
  trip: Trip;
  time: string;
  minutesAway: number;
}[] {
  const now = getCurrentMinutes();

  const departures: { trip: Trip; time: string; minutesAway: number }[] = [];

  for (const trip of trips) {
    if (trip.serviceType !== serviceType) continue;
    if (direction !== undefined && trip.direction !== direction) continue;

    const stop = trip.stops.find((s) => s.stationId === stationId);
    if (!stop) continue;

    const tripMinutes = parseTime(stop.time);
    let minutesAway = tripMinutes - now;
    if (minutesAway < -60) minutesAway += 1440; // wrap around midnight

    departures.push({
      trip,
      time: stop.time,
      minutesAway,
    });
  }

  // Sort by time
  departures.sort((a, b) => {
    if (a.minutesAway < 0 && b.minutesAway >= 0) return 1;
    if (a.minutesAway >= 0 && b.minutesAway < 0) return -1;
    return a.minutesAway - b.minutesAway;
  });

  return departures;
}

// Get trip by ID
export function getTrip(id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}

// Direction labels
export function getDirectionLabel(direction: number): string {
  return direction === 0 ? "Northbound" : "Southbound";
}

export function getDirectionIcon(direction: number): string {
  return direction === 0 ? "arrow.up" : "arrow.down";
}
