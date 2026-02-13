import { useMemo } from "react";
import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const AppleStackPreset: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
    : isLiquidGlassAvailable()
    ? {
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: "transparent" },
        headerTitleStyle: { color: AC.label as any },
        headerBlurEffect: "none",
        headerBackButtonDisplayMode: "minimal",
      }
    : {
        headerTransparent: true,
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: "transparent" },
        headerBlurEffect: "systemChromeMaterial",
        headerBackButtonDisplayMode: "default",
      };

export const unstable_settings = {
  stations: { anchor: "index" },
  schedule: { anchor: "schedule" },
};

export default function SharedLayout({ segment }: { segment: string }) {
  const screen = segment.match(/\((.*)\)/)?.[1]!;

  const anchor = screen === "stations" ? "index" : "schedule";

  const options = useMemo(() => {
    switch (screen) {
      case "stations":
        return { title: "Stations", headerLargeTitle: true };
      case "schedule":
        return { title: "Schedule", headerLargeTitle: true };
      default:
        return {};
    }
  }, [screen]);

  return (
    <Stack screenOptions={{ ...AppleStackPreset, headerLargeTitle: false }}>
      <Stack.Screen name={anchor} options={options} />
    </Stack>
  );
}
