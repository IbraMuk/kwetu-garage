import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;

  const menuItems = [
    { id: "Dashboard", label: "Tableau de bord", icon: "grid" },
    { id: "Clients", label: "Clients", icon: "people" },
    { id: "Vehicles", label: "Véhicules", icon: "car" },
    { id: "Repairs", label: "Réparations", icon: "build" },
    { id: "Parts", label: "Pièces", icon: "cube" },
    { id: "Invoices", label: "Factures", icon: "document-text" },
    { id: "Profile", label: "Profil", icon: "person" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.title}>Kwetu Garage</Text>
          <Text style={styles.subtitle}>Gestion Pro</Text>
        </View>
      </View>

      {/* Menu Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        {menuItems.map((item) => {
          const currentRouteName = state.routeNames[state.index];
          const isActive = currentRouteName === item.id;
          return (
            <DrawerItem
              key={item.id}
              label={item.label}
              icon={({ color, size }) => (
                <Ionicons
                  name={item.icon as any}
                  size={size}
                  color={isActive ? colors.primaryLight : color}
                />
              )}
              onPress={() => navigation.navigate(item.id)}
              activeTintColor={colors.primaryLight}
              inactiveTintColor={colors.text}
              activeBackgroundColor={`${colors.primary}20`}
              style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
              labelStyle={[styles.drawerLabel, isActive && styles.activeDrawerLabel]}
            />
          );
        })}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMid,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    overflow: "hidden",
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  drawerContent: {
    paddingTop: spacing.md,
  },
  drawerItem: {
    marginHorizontal: spacing.sm,
    marginVertical: 2,
    borderRadius: 12,
  },
  activeDrawerItem: {
    backgroundColor: `${colors.primary}20`,
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  activeDrawerLabel: {
    color: colors.primaryLight,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.textDim,
  },
});
