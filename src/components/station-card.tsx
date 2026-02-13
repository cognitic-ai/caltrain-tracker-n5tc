import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import * as AC from "@bacons/apple-colors";
import { Link } from "expo-router";
import {
  Station,
  getDepartures,
  getCurrentServiceType,
  formatTime,
  getRouteDisplayColor,
  getRouteLabel,
} from "@/data/caltrain";

export default function StationCard({ station }: { station: Station }) {
  const serviceType = getCurrentServiceType();
  const nextDepartures = getDepartures(station.id, serviceType).slice(0, 2);

  return (
    <Link href={`/station/${station.id}`} asChild>
      <Link.Trigger withAppleZoom>
        <Pressable
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground as any,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: 16,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
              <Image
                source="sf:tram.fill"
                style={{
                  width: 22,
                  height: 22,
                  tintColor: AC.systemRed as any,
                }}
              />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  color: AC.label as any,
                }}
                numberOfLines={1}
              >
                {station.name}
              </Text>
            </View>
            <Image
              source="sf:chevron.right"
              style={{
                width: 12,
                height: 12,
                tintColor: AC.tertiaryLabel as any,
              }}
            />
          </View>

          {nextDepartures.length > 0 && (
            <View style={{ gap: 6 }}>
              {nextDepartures.map((dep, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: getRouteDisplayColor(dep.trip.routeName),
                      borderRadius: 4,
                      borderCurve: "continuous",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      {getRouteLabel(dep.trip.routeName)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: AC.secondaryLabel as any,
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {dep.trip.headsign}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: AC.label as any,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {formatTime(dep.time)}
                  </Text>
                  {dep.minutesAway >= 0 && dep.minutesAway <= 90 && (
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: dep.minutesAway <= 5
                          ? (AC.systemRed as any)
                          : (AC.systemGreen as any),
                        fontVariant: ["tabular-nums"],
                        minWidth: 40,
                        textAlign: "right",
                      }}
                    >
                      {dep.minutesAway <= 0
                        ? "Now"
                        : `${dep.minutesAway}m`}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction
          title="View Departures"
          icon="clock"
          onPress={() => {}}
        />
      </Link.Menu>
    </Link>
  );
}
