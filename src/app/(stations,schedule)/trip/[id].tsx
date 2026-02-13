import { View, Text, ScrollView } from "react-native";
import { Stack, useLocalSearchParams, Link } from "expo-router";
import { Image } from "expo-image";
import * as AC from "@bacons/apple-colors";
import {
  getTrip,
  getStation,
  formatTime,
  getRouteDisplayColor,
  getRouteLabel,
  getDirectionLabel,
  parseTime,
} from "@/data/caltrain";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTrip(id);

  if (!trip) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: AC.secondaryLabel as any }}>Trip not found</Text>
      </View>
    );
  }

  const routeColor = getRouteDisplayColor(trip.routeName);
  const firstStop = trip.stops[0];
  const lastStop = trip.stops[trip.stops.length - 1];
  const totalMinutes = firstStop && lastStop
    ? parseTime(lastStop.time) - parseTime(firstStop.time)
    : 0;

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
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
                backgroundColor: routeColor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "800",
                  color: "white",
                }}
              >
                #{trip.number}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: AC.label as any,
                }}
              >
                Train #{trip.number}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: AC.secondaryLabel as any,
                }}
              >
                {getRouteLabel(trip.routeName)} · {getDirectionLabel(trip.direction)}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 16 }}>
            <InfoBadge
              icon="sf:mappin.and.ellipse"
              label="To"
              value={trip.headsign}
            />
            <InfoBadge
              icon="sf:clock"
              label="Duration"
              value={`${totalMinutes} min`}
            />
            <InfoBadge
              icon="sf:stop"
              label="Stops"
              value={`${trip.stops.length}`}
            />
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
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
            Stops
          </Text>
        </View>

        {trip.stops.map((stop, index) => {
          const station = getStation(stop.stationId);
          const isFirst = index === 0;
          const isLast = index === trip.stops.length - 1;

          return (
            <Link
              key={`${stop.stationId}-${index}`}
              href={`/station/${stop.stationId}`}
              asChild
            >
              <Link.Trigger>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 0,
                  }}
                >
                  {/* Timeline */}
                  <View
                    style={{
                      width: 32,
                      alignItems: "center",
                      paddingVertical: 0,
                    }}
                  >
                    {!isFirst && (
                      <View
                        style={{
                          width: 2,
                          height: 16,
                          backgroundColor: routeColor,
                          opacity: 0.3,
                        }}
                      />
                    )}
                    <View
                      style={{
                        width: isFirst || isLast ? 14 : 10,
                        height: isFirst || isLast ? 14 : 10,
                        borderRadius: isFirst || isLast ? 7 : 5,
                        backgroundColor: isFirst || isLast ? routeColor : "transparent",
                        borderWidth: isFirst || isLast ? 0 : 2,
                        borderColor: routeColor,
                      }}
                    />
                    {!isLast && (
                      <View
                        style={{
                          width: 2,
                          height: 16,
                          backgroundColor: routeColor,
                          opacity: 0.3,
                        }}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 4,
                      paddingLeft: 12,
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: isFirst || isLast ? "600" : "400",
                        color: AC.label as any,
                        flex: 1,
                      }}
                    >
                      {station?.name ?? stop.stationId}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                        color: AC.secondaryLabel as any,
                        fontVariant: ["tabular-nums"],
                      }}
                      selectable
                    >
                      {formatTime(stop.time)}
                    </Text>
                  </View>
                </View>
              </Link.Trigger>
            </Link>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
      <Stack.Screen
        options={{
          title: `Train #${trip.number}`,
        }}
      />
      <TripToolbar trip={trip} />
    </>
  );
}

function TripToolbar({ trip }: { trip: any }) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="ellipsis">
        <Stack.Toolbar.MenuAction icon="square.and.arrow.up">
          Share Trip
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="bell">
          Set Reminder
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}

function InfoBadge({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
      <Image
        source={icon}
        style={{
          width: 18,
          height: 18,
          tintColor: AC.secondaryLabel as any,
        }}
      />
      <Text
        style={{
          fontSize: 11,
          color: AC.tertiaryLabel as any,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "600",
          color: AC.label as any,
        }}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}
