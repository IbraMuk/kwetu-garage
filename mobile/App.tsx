import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AuthApiBridge from "./src/components/AuthApiBridge";
import CustomDrawerContent from "./src/components/CustomDrawerContent";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import type { MainTabParamList, RootStackParamList } from "./src/navigation/types";
import ClientsScreen from "./src/screens/ClientsScreen";
import HomeScreen from "./src/screens/HomeScreen";
import InvoicesScreen from "./src/screens/InvoicesScreen";
import LandingScreen from "./src/screens/LandingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import PartsScreen from "./src/screens/PartsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RepairsScreen from "./src/screens/RepairsScreen";
import VehiclesScreen from "./src/screens/VehiclesScreen";
import { colors, commonStyles } from "./src/theme";

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<MainTabParamList>();

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

function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.backgroundMid,
          width: 280,
        },
        drawerActiveTintColor: colors.primaryLight,
        drawerInactiveTintColor: colors.text,
        sceneContainerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{ title: "Tableau de bord" }}
      />
      <Drawer.Screen name="Clients" component={ClientsScreen} options={{ title: "Clients" }} />
      <Drawer.Screen name="Vehicles" component={VehiclesScreen} options={{ title: "Véhicules" }} />
      <Drawer.Screen name="Repairs" component={RepairsScreen} options={{ title: "Réparations" }} />
      <Drawer.Screen name="Parts" component={PartsScreen} options={{ title: "Pièces" }} />
      <Drawer.Screen name="Invoices" component={InvoicesScreen} options={{ title: "Factures" }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
    </Drawer.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading, token } = useAuth();

  if (isLoading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated || !token) {
    return (
      <Stack.Navigator key="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator key="main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainDrawer} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer theme={navTheme}>
            <AuthProvider>
              <AuthApiBridge />
              <StatusBar style="light" />
              <RootNavigator />
            </AuthProvider>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
