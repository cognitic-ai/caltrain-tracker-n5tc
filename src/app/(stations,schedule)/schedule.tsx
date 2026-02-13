import { useCallback, useState, useMemo } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { Stack } from "expo-router";
import * as AC from "@bacons/apple-colors";
import {
  trips,
  getCurrentServiceType,
  ServiceType,
} from "@/data/caltrain";
import useSearch from "@/hooks/use-search";
import DepartureRow from "@/components/departure-row";

export default function ScheduleScreen() {
  const search = useSearch({ placeholder: "Search trips" });
  const [refreshing, setRefreshing] = useState(false);
  const [, setTick] = useState(0);
  const [serviceFilter, setServiceFilter] = useState<ServiceType>(
    getCurrentServiceType()
  );
  const [directionFilter, setDirectionFilter] = useState<number | null>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTick((t) => t + 1);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const filteredTrips = useMemo(() => {
    let result = trips.filter((t) => t.serviceType === serviceFilter);
    if (directionFilter !== null) {
      result = result.filter((t) => t.direction === directionFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.number.includes(q) ||
          t.headsign.toLowerCase().includes(q) ||
          t.routeName.toLowerCase().includes(q)
      );
    }
    // Sort by first stop departure time
    result.sort((a, b) => {
      const aTime = a.stops[0]?.time ?? "99:99";
      const bTime = b.stops[0]?.time ?? "99:99";
      return aTime.localeCompare(bTime);
    });
    return result;
  }, [serviceFilter, directionFilter, search]);

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <FilterChip
            label="Weekday"
            active={serviceFilter === "weekday"}
            onPress={() => setServiceFilter("weekday")}
          />
          <FilterChip
            label="Weekend"
            active={serviceFilter === "weekend"}
            onPress={() => setServiceFilter("weekend")}
          />
          <View style={{ width: 1, backgroundColor: AC.separator as any }} />
          <FilterChip
            label="All"
            active={directionFilter === null}
            onPress={() => setDirectionFilter(null)}
          />
          <FilterChip
            label="NB"
            active={directionFilter === 0}
            onPress={() => setDirectionFilter(0)}
          />
          <FilterChip
            label="SB"
            active={directionFilter === 1}
            onPress={() => setDirectionFilter(1)}
          />
        </View>

        {filteredTrips.map((trip) => {
          const firstStop = trip.stops[0];
          if (!firstStop) return null;

          const now = new Date();
          const ptOffset = -7 * 60;
          const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
          let ptMinutes = utcMinutes + ptOffset;
          if (ptMinutes < 0) ptMinutes += 1440;

          const [h, m] = firstStop.time.split(":").map(Number);
          const tripMinutes = h * 60 + m;
          let minutesAway = tripMinutes - ptMinutes;
          if (minutesAway < -60) minutesAway += 1440;

          return (
            <DepartureRow
              key={trip.id}
              trip={trip}
              time={firstStop.time}
              minutesAway={minutesAway}
            />
          );
        })}

        {filteredTrips.length === 0 && (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: AC.secondaryLabel as any }}>
              No trips found
            </Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
      <ScheduleToolbar
        count={filteredTrips.length}
        serviceFilter={serviceFilter}
      />
    </>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Text
      onPress={onPress}
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: active ? "white" : (AC.label as any),
        backgroundColor: active
          ? (AC.systemBlue as any)
          : (AC.tertiarySystemFill as any),
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {label}
    </Text>
  );
}

function ScheduleToolbar({
  count,
  serviceFilter,
}: {
  count: number;
  serviceFilter: ServiceType;
}) {
  return (
    <Stack.Toolbar placement="bottom">
      <Stack.Toolbar.View>
        <View style={{ width: 200, height: 20, justifyContent: "center" }}>
          <Text
            style={{
              fontSize: 12,
              color: AC.secondaryLabel as any,
              fontVariant: ["tabular-nums"],
            }}
          >
            {count} {serviceFilter} trips
          </Text>
        </View>
      </Stack.Toolbar.View>
      <Stack.Toolbar.Spacer />
    </Stack.Toolbar>
  );
}
