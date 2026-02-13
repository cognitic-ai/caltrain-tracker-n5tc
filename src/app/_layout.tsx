import { ThemeProvider } from "@/components/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs as WebTabs } from "expo-router/tabs";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      {process.env.EXPO_OS === "web" ? (
        <WebTabsLayout />
      ) : (
        <NativeTabsLayout />
      )}
    </ThemeProvider>
  );
}

function WebTabsLayout() {
  return (
    <WebTabs screenOptions={{ headerShown: false }}>
      <WebTabs.Screen
        name="(stations)"
        options={{
          title: "Stations",
          tabBarIcon: (props) => <MaterialIcons {...props} name="train" />,
        }}
      />
      <WebTabs.Screen
        name="(schedule)"
        options={{
          title: "Schedule",
          tabBarIcon: (props) => <MaterialIcons {...props} name="schedule" />,
        }}
      />
    </WebTabs>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(stations)">
        <NativeTabs.Trigger.Label>Stations</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: {
              sf: { default: "tram", selected: "tram.fill" },
            },
            default: {
              src: (
                <NativeTabs.Trigger.VectorIcon
                  family={MaterialIcons}
                  name="train"
                />
              ),
            },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(schedule)">
        <NativeTabs.Trigger.Label>Schedule</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: {
              sf: { default: "clock", selected: "clock.fill" },
            },
            default: {
              src: (
                <NativeTabs.Trigger.VectorIcon
                  family={MaterialIcons}
                  name="schedule"
                />
              ),
            },
          })}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
