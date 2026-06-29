import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import ScreenLayout from "../components/ScreenLayout";
import { useAuth } from "../contexts/AuthContext";
import { useUserMenu } from "../hooks/useUserMenu";
import { colors, commonStyles, spacing } from "../theme";

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  manager: "Manager",
  mechanic: "Mécanicien",
  receptionist: "Réceptionniste",
};

const roleIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  admin: "shield-checkmark",
  manager: "briefcase",
  mechanic: "build",
  receptionist: "call",
};

export default function ProfileScreen() {
  const { user: userInfo, isDemo } = useAuth();
  const { confirmLogout } = useUserMenu();
  const loading = !userInfo;

  const showInfo = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const options: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
  }[] = [
    {
      icon: "person-outline",
      label: "Modifier le profil",
      onPress: () =>
        showInfo(
          "Profil",
          isDemo
            ? "En mode démo, connectez-vous avec un compte réel pour modifier le profil sur le serveur."
            : "La modification du profil depuis le mobile sera disponible dans une prochaine version. Utilisez la version web en attendant.",
        ),
    },
    {
      icon: "settings-outline",
      label: "Paramètres",
      onPress: () =>
        showInfo(
          "Paramètres",
          "Configurez EXPO_PUBLIC_API_URL dans mobile/.env pour pointer vers votre API (ex. http://192.168.x.x:3001/api sur téléphone).",
        ),
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      onPress: () => showInfo("Notifications", "Les notifications push seront activées prochainement."),
    },
    {
      icon: "help-circle-outline",
      label: "Aide et support",
      onPress: () =>
        showInfo(
          "Aide",
          "Connexion API : admin@kwetugarage.com / password123\nMode démo : données locales sans serveur.",
        ),
    },
    {
      icon: "information-circle-outline",
      label: "À propos",
      onPress: () =>
        showInfo(
          "Kwetu Garage",
          "Application mobile de gestion d'atelier — clients, véhicules, réparations et tableau de bord.",
        ),
    },
  ];

  if (loading) {
    return (
      <ScreenLayout>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Chargement du profil...</Text>
        </View>
      </ScreenLayout>
    );
  }

  const role = userInfo?.role ?? "";
  const roleIcon = roleIcons[role] ?? "person";

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={commonStyles.scrollContent}>
        <ScreenHeader title="Profil" subtitle="Votre compte Kwetu Garage" />

        <View style={[commonStyles.glassCard, styles.profileCard]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInfo?.first_name?.[0]}
              {userInfo?.last_name?.[0]}
            </Text>
          </View>
          <Text style={styles.userName}>
            {userInfo?.first_name} {userInfo?.last_name}
          </Text>
          <View style={styles.roleRow}>
            <Ionicons name={roleIcon} size={16} color={colors.primaryLight} />
            <Text style={styles.role}>{roleLabels[role] ?? role}</Text>
          </View>
          <Text style={styles.email}>{userInfo?.email}</Text>
          {isDemo ? (
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>Mode démo — données locales</Text>
            </View>
          ) : null}
        </View>

        <View style={commonStyles.glassCard}>
          {options.map((opt, i) => (
            <View key={opt.label}>
              <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={opt.onPress}>
                <View style={styles.optionLeft}>
                  <Ionicons name={opt.icon} size={22} color={colors.textMuted} />
                  <Text style={styles.optionText}>{opt.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
              </TouchableOpacity>
              {i < options.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Kwetu Garage Mobile v1.0.0</Text>
        <Text style={styles.copyright}>© 2024 Kwetu Garage</Text>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: "center", paddingVertical: spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: colors.text },
  userName: { fontSize: 22, fontWeight: "800", color: colors.text },
  roleRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm },
  role: { fontSize: 14, color: colors.primaryLight, fontWeight: "600" },
  email: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  demoBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.35)",
  },
  demoBadgeText: { fontSize: 12, color: colors.warning, fontWeight: "600" },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  optionText: { fontSize: 16, color: colors.text },
  divider: { height: 1, backgroundColor: colors.glassBorder },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  logoutText: { color: colors.error, fontWeight: "700", fontSize: 16 },
  version: { textAlign: "center", marginTop: spacing.lg, color: colors.textMuted, fontSize: 12 },
  copyright: { textAlign: "center", marginTop: 4, color: colors.textDim, fontSize: 11, marginBottom: spacing.lg },
});
