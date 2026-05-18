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
import { apiService } from "../services/apiService";
import { storageService, UserInfo } from "../services/storageService";
import { colors, commonStyles, spacing } from "../theme";

interface DashboardStats {
  totalClients: number;
  totalVehicles: number;
  totalRepairs: number;
  pendingRepairs: number;
  completedRepairs: number;
}

export default function HomeScreen({ navigation }: any) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalVehicles: 0,
    totalRepairs: 0,
    pendingRepairs: 0,
    completedRepairs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
    loadDashboardStats();
  }, []);

  const loadUserInfo = async () => {
    try {
      setUserInfo(await storageService.getUserInfo());
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const [clients, vehicles, repairs] = await Promise.all([
        apiService.getClients(),
        apiService.getVehicles(),
        apiService.getRepairs(),
      ]);
      setStats({
        totalClients: clients.length,
        totalVehicles: vehicles.length,
        totalRepairs: repairs.length,
        pendingRepairs: repairs.filter((r: { status: string }) => r.status === "pending").length,
        completedRepairs: repairs.filter((r: { status: string }) => r.status === "completed").length,
      });
    } catch {
      Alert.alert("Erreur", "Impossible de charger les statistiques");
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <ScreenLayout>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Chargement...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={commonStyles.scrollContent}>
        <ScreenHeader
          title="Tableau de bord"
          subtitle={
            userInfo?.first_name
              ? `Bonjour ${userInfo.first_name} · Vue d'ensemble`
              : "Vue d'ensemble de votre garage"
          }
        />

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInfo?.first_name?.[0]}
              {userInfo?.last_name?.[0]}
            </Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userName}>
              {userInfo?.first_name} {userInfo?.last_name}
            </Text>
            <Text style={styles.userRole}>{userInfo?.role}</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>

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
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  userCard: {
    ...commonStyles.glassCard,
    flexDirection: "row",
    alignItems: "center",
    marginTop: -spacing.sm,
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
  userMeta: { flex: 1 },
  userName: { fontSize: 17, fontWeight: "800", color: colors.text },
  userRole: { fontSize: 13, color: colors.textMuted, marginTop: 2, textTransform: "capitalize" },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.emerald,
    borderWidth: 2,
    borderColor: colors.background,
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
