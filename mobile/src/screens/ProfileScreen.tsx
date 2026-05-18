import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import { authService } from "../services/authService";
import { storageService, UserInfo } from "../services/storageService";
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

export default function ProfileScreen({ navigation }: any) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setUserInfo(await storageService.getUserInfo());
    } catch (error) {
      console.error("Error loading user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          try {
            await authService.logout();
          } finally {
            await storageService.clearAuth();
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          }
        },
      },
    ]);
  };

  const options: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { icon: "person-outline", label: "Modifier le profil" },
    { icon: "settings-outline", label: "Paramètres" },
    { icon: "notifications-outline", label: "Notifications" },
    { icon: "help-circle-outline", label: "Aide et support" },
    { icon: "information-circle-outline", label: "À propos" },
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
        </View>

        <View style={commonStyles.glassCard}>
          {options.map((opt, i) => (
            <View key={opt.label}>
              <TouchableOpacity style={styles.option} activeOpacity={0.7}>
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

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
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
