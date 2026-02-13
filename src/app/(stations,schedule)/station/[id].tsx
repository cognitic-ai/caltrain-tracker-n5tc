import { useCallback, useState, useMemo } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { Stack, useLocalSearchParams, Link } from "expo-router";
import { Image } from "expo-image";
import * as AC from "@bacons/apple-colors";
import {
  getStation,
  getDepartures,
  getCurrentServiceType,
  ServiceType,
  formatTime,
} from "@/data/caltrain";
import DepartureRow from "@/components/departure-row";

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const station = getStation(id);
  const [refreshing, setRefreshing] = useState(false);
  const [, setTick] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType>(
    getCurrentServiceType()
  );
  const [direction, setDirection] = useState<number | undefined>(undefined);

  const departures = useMemo(
    () =>
      station ? getDepartures(station.id, serviceType, direction) : [],
    [station, serviceType, direction]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTick((t) => t + 1);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  if (!station) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: AC.secondaryLabel as any }}>
          Station not found
        </Text>
      </View>
    );
  }

  const upcomingCount = departures.filter((d) => d.minutesAway >= 0).length;

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Link.AppleZoomTarget>
          <View
            style={{
              padding: 20,
              gap: 12,
              backgroundColor: AC.secondarySystemBackground as any,
              borderBottomWidth: 0.5,
              borderBottomColor: AC.separator as any,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  borderCurve: "continuous",
                  backgroundColor: "#CE202F",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source="sf:tram.fill"
                  style={{ width: 24, height: 24, tintColor: "white" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: AC.label as any,
                  }}
                >
                  {station.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: AC.secondaryLabel as any,
                  }}
                  selectable
                >
                  {station.lat.toFixed(4)}N, {Math.abs(station.lon).toFixed(4)}W
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <FilterPill
                label="Weekday"
                active={serviceType === "weekday"}
                onPress={() => setServiceType("weekday")}
              />
              <FilterPill
                label="Weekend"
                active={serviceType === "weekend"}
                onPress={() => setServiceType("weekend")}
              />
              <View style={{ width: 8 }} />
              <FilterPill
                label="All"
                active={direction === undefined}
                onPress={() => setDirection(undefined)}
              />
              <FilterPill
                label="NB"
                active={direction === 0}
                onPress={() => setDirection(0)}
              />
              <FilterPill
                label="SB"
                active={direction === 1}
                onPress={() => setDirection(1)}
              />
            </View>
          </View>
        </Link.AppleZoomTarget>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: AC.secondaryLabel as any,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Departures ({upcomingCount} upcoming)
          </Text>
        </View>

        {departures.map((dep, i) => (
          <DepartureRow
            key={`${dep.trip.id}-${i}`}
            trip={dep.trip}
            time={dep.time}
            minutesAway={dep.minutesAway}
          />
        ))}

        {departures.length === 0 && (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: AC.secondaryLabel as any }}>
              No departures found
            </Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
      <Stack.Screen options={{ title: station.name }} />
      <StationToolbar station={station} />
    </>
  );
}

function StationToolbar({ station }: { station: any }) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="ellipsis">
        <Stack.Toolbar.MenuAction icon="map">
          View on Map
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="square.and.arrow.up">
          Share Station
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}

function FilterPill({
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
