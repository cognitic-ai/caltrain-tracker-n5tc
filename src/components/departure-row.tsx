import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import * as AC from "@bacons/apple-colors";
import {
  Trip,
  formatTime,
  getRouteDisplayColor,
  getRouteLabel,
  getDirectionLabel,
} from "@/data/caltrain";

export default function DepartureRow({
  trip,
  time,
  minutesAway,
}: {
  trip: Trip;
  time: string;
  minutesAway: number;
}) {
  const routeColor = getRouteDisplayColor(trip.routeName);
  const isPast = minutesAway < 0;

  return (
    <Link href={`/trip/${trip.id}`} asChild>
      <Link.Trigger>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
            gap: 12,
            opacity: isPast ? 0.4 : 1,
          }}
        >
          <View
            style={{
              backgroundColor: routeColor,
              borderRadius: 6,
              borderCurve: "continuous",
              paddingHorizontal: 8,
              paddingVertical: 4,
              minWidth: 60,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: "white",
              }}
            >
              {getRouteLabel(trip.routeName)}
            </Text>
          </View>

          <View style={{ flex: 1, gap: 2 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: AC.label as any,
              }}
              numberOfLines={1}
            >
              #{trip.number} to {trip.headsign}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: AC.secondaryLabel as any,
              }}
            >
              {getDirectionLabel(trip.direction)} · {trip.stops.length} stops
            </Text>
          </View>

          <View style={{ alignItems: "flex-end", gap: 2 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: AC.label as any,
                fontVariant: ["tabular-nums"],
              }}
              selectable
            >
              {formatTime(time)}
            </Text>
            {!isPast && minutesAway <= 90 && (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color:
                    minutesAway <= 5
                      ? (AC.systemRed as any)
                      : (AC.systemGreen as any),
                  fontVariant: ["tabular-nums"],
                }}
              >
                {minutesAway <= 0 ? "Departing now" : `in ${minutesAway} min`}
              </Text>
            )}
          </View>

          <Image
            source="sf:chevron.right"
            style={{
              width: 10,
              height: 10,
              tintColor: AC.tertiaryLabel as any,
            }}
          />
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
    </Link>
  );
}
