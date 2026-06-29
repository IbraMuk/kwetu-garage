import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import ScreenLayout from "../components/ScreenLayout";
import { UserAccountCard } from "../components/UserMenuButton";
import { useAuth } from "../contexts/AuthContext";
import type { MainTabParamList } from "../navigation/types";
import { apiService } from "../services/apiService";
import { colors, commonStyles, spacing } from "../theme";

interface DashboardStats {
  totalClients: number;
  totalVehicles: number;
  totalRepairs: number;
  pendingRepairs: number;
  completedRepairs: number;
}

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, "Dashboard">>();
  const { user, isDemo } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalVehicles: 0,
    totalRepairs: 0,
    pendingRepairs: 0,
    completedRepairs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const loadDashboardStats = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setStatsError(null);
    try {
      const [clients, vehicles, repairs] = await Promise.all([
        apiService.getClients(),
        apiService.getVehicles(),
        apiService.getRepairs(),
      ]);
      setStats({
        totalClients: clients.length,
        totalVehicles: vehicles.length,
        totalRepairs: repairs.length,
        pendingRepairs: repairs.filter((r) => r.status === "pending").length,
        completedRepairs: repairs.filter((r) => r.status === "completed").length,
      });
    } catch {
      setStatsError(
        "Statistiques indisponibles. Vérifiez que l'API tourne (Next.js ou backend) et EXPO_PUBLIC_API_URL sur téléphone.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadDashboardStats();
    }, [loadDashboardStats]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    void loadDashboardStats(true);
  };

  const StatCard = ({
    icon,
    title,
    value,
    color,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value: number;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.statIcon, { backgroundColor: `${color}33` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <ScreenHeader
          title="Tableau de bord"
          subtitle={
            user?.first_name
              ? `Bonjour ${user.first_name} · Vue d'ensemble`
              : "Vue d'ensemble de votre garage"
          }
          showUserButton
        />

        {isDemo ? (
          <View style={styles.demoBanner}>
            <Ionicons name="flask-outline" size={18} color={colors.warning} />
            <Text style={styles.demoBannerText}>
              Mode démo — vous pouvez ajouter clients, véhicules et réparations sans serveur.
            </Text>
          </View>
        ) : null}

        <UserAccountCard />

        {statsError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={20} color={colors.warning} />
            <Text style={styles.errorText}>{statsError}</Text>
            <TouchableOpacity onPress={() => loadDashboardStats()} style={styles.retryBtn}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {loading && !refreshing ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={commonStyles.loadingText}>Chargement des statistiques...</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsGrid}>
              <StatCard
                icon="people"
                title="Clients"
                value={stats.totalClients}
                color={colors.primaryLight}
                onPress={() => navigation.navigate("Clients")}
              />
              <StatCard
                icon="car"
                title="Véhicules"
                value={stats.totalVehicles}
                color={colors.emerald}
                onPress={() => navigation.navigate("Vehicles")}
              />
              <StatCard
                icon="build"
                title="Réparations"
                value={stats.totalRepairs}
                color={colors.warning}
                onPress={() => navigation.navigate("Repairs")}
              />
              <StatCard
                icon="time"
                title="En attente"
                value={stats.pendingRepairs}
                color={colors.error}
                onPress={() => navigation.navigate("Repairs")}
              />
            </View>

            <View style={commonStyles.glassCard}>
              <Text style={commonStyles.sectionTitle}>Statistiques</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailValue}>{stats.completedRepairs}</Text>
                <Text style={styles.detailLabel}>Terminées</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailValue}>
                  {stats.totalRepairs > 0
                    ? Math.round((stats.completedRepairs / stats.totalRepairs) * 100)
                    : 0}
                  %
                </Text>
                <Text style={styles.detailLabel}>Taux de complétion</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  demoBanner: {
    ...commonStyles.glassCard,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    borderColor: "rgba(245, 158, 11, 0.35)",
    marginTop: -spacing.sm,
  },
  demoBannerText: { flex: 1, fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  errorBanner: {
    ...commonStyles.glassCard,
    borderColor: "rgba(245, 158, 11, 0.4)",
    gap: spacing.sm,
  },
  errorText: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  retryBtn: { alignSelf: "flex-start" },
  retryText: { color: colors.primaryLight, fontWeight: "700" },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  statCard: {
    width: "48%",
    ...commonStyles.glassCard,
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statValue: { fontSize: 26, fontWeight: "800", color: colors.text },
  statTitle: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  detailValue: { fontSize: 20, fontWeight: "800", color: colors.primaryLight },
  detailLabel: { fontSize: 14, color: colors.textMuted },
});
