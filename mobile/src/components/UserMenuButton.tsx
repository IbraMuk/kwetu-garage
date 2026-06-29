import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUserMenu } from "../hooks/useUserMenu";
import { colors, spacing } from "../theme";

type UserMenuButtonProps = {
  size?: "sm" | "md";
};

export default function UserMenuButton({ size = "md" }: UserMenuButtonProps) {
  const { user, openUserMenu } = useUserMenu();
  const dim = size === "sm" ? 40 : 44;

  return (
    <TouchableOpacity
      style={[styles.btn, { width: dim, height: dim, borderRadius: dim / 3 }]}
      onPress={openUserMenu}
      activeOpacity={0.85}
      accessibilityLabel="Menu utilisateur"
      accessibilityRole="button"
    >
      <Text style={[styles.initials, size === "sm" && styles.initialsSm]}>
        {user?.first_name?.[0]}
        {user?.last_name?.[0]}
      </Text>
    </TouchableOpacity>
  );
}

/** Carte utilisateur cliquable (tableau de bord). */
export function UserAccountCard() {
  const { user, openUserMenu } = useUserMenu();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={openUserMenu}
      activeOpacity={0.85}
      accessibilityLabel="Ouvrir le menu utilisateur"
      accessibilityRole="button"
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.first_name?.[0]}
          {user?.last_name?.[0]}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.name}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.role}>{user?.role}</Text>
        <Text style={styles.hint}>Appuyer pour profil ou déconnexion</Text>
      </View>
      <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  initials: { color: colors.text, fontSize: 16, fontWeight: "800" },
  initialsSm: { fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 20,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  avatarText: { color: colors.text, fontSize: 18, fontWeight: "800" },
  meta: { flex: 1 },
  name: { fontSize: 17, fontWeight: "800", color: colors.text },
  role: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: "capitalize",
  },
  hint: { fontSize: 11, color: colors.textDim, marginTop: 4 },
});
