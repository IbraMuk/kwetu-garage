import "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { MD3DarkTheme, Provider as PaperProvider } from "react-native-paper";

import ClientsScreen from "./src/screens/ClientsScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RepairsScreen from "./src/screens/RepairsScreen";
import VehiclesScreen from "./src/screens/VehiclesScreen";
import { colors } from "./src/theme";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.backgroundMid,
    onSurface: colors.text,
    onSurfaceVariant: colors.textMuted,
    outline: colors.glassBorder,
  },
};

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.backgroundMid,
    text: colors.text,
    border: colors.glassBorder,
    notification: colors.primary,
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help";

          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Clients") iconName = focused ? "people" : "people-outline";
          else if (route.name === "Vehicles") iconName = focused ? "car" : "car-outline";
          else if (route.name === "Repairs") iconName = focused ? "build" : "build-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Accueil" }} />
      <Tab.Screen name="Clients" component={ClientsScreen} options={{ title: "Clients" }} />
      <Tab.Screen name="Vehicles" component={VehiclesScreen} options={{ title: "Véhicules" }} />
      <Tab.Screen name="Repairs" component={RepairsScreen} options={{ title: "Réparations" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
