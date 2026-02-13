import { useCallback, useState, useMemo } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { Stack } from "expo-router";
import * as AC from "@bacons/apple-colors";
import { stations } from "@/data/caltrain";
import StationCard from "@/components/station-card";
import useSearch from "@/hooks/use-search";

export default function StationsScreen() {
  const search = useSearch({ placeholder: "Search stations" });
  const [refreshing, setRefreshing] = useState(false);
  const [, setTick] = useState(0);

  const filteredStations = useMemo(() => {
    if (!search) return stations;
    const q = search.toLowerCase();
    return stations.filter((s) => s.name.toLowerCase().includes(q));
  }, [search]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTick((t) => t + 1);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 32 }}
      >
        {filteredStations.length === 0 && (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                color: AC.secondaryLabel as any,
              }}
            >
              No stations found
            </Text>
          </View>
        )}
        {filteredStations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </ScrollView>
      <StationsToolbar />
    </>
  );
}

function StationsToolbar() {
  return (
    <Stack.Toolbar placement="bottom">
      <Stack.Toolbar.View>
        <View style={{ width: 200, height: 20, justifyContent: "center" }}>
          <Text
            style={{
              fontSize: 12,
              color: AC.secondaryLabel as any,
            }}
          >
            {stations.length} stations · Real Caltrain GTFS data
          </Text>
        </View>
      </Stack.Toolbar.View>
      <Stack.Toolbar.Spacer />
    </Stack.Toolbar>
  );
}
