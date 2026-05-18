import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
import ScreenHeader from "../components/ScreenHeader";
import ScreenLayout from "../components/ScreenLayout";
import { apiService } from "../services/apiService";
import { Repair } from "../types";
import { colors, commonStyles, spacing } from "../theme";

const statusColors: Record<string, string> = {
  pending: colors.warning,
  in_progress: colors.primaryLight,
  completed: colors.emerald,
  cancelled: colors.error,
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

export default function RepairsScreen({ navigation }: any) {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRepairs();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredRepairs(
      repairs.filter(
        (r) =>
          r.description.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q),
      ),
    );
  }, [repairs, searchQuery]);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      setRepairs(await apiService.getRepairs());
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de charger les réparations",
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setRepairs(await apiService.getRepairs());
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Impossible de rafraîchir");
    } finally {
      setRefreshing(false);
    }
  };

  const renderRepair = ({ item }: { item: Repair }) => {
    const statusColor = statusColors[item.status] ?? colors.textMuted;
    return (
      <TouchableOpacity
        style={commonStyles.listCard}
        onPress={() =>
          Alert.alert(
            item.description,
            `Statut : ${statusLabels[item.status] ?? item.status}\nCoût : ${item.total_cost.toLocaleString("fr-FR")} €`,
          )
        }
        activeOpacity={0.85}
      >
        <View style={styles.headerRow}>
          <View style={[styles.iconWrap, { backgroundColor: `${statusColor}22` }]}>
            <Ionicons
              name={item.status === "completed" ? "checkmark-circle" : "time"}
              size={22}
              color={statusColor}
            />
          </View>
          <View style={styles.flex}>
            <Text style={commonStyles.listCardTitle} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={[styles.badge, { color: statusColor }]}>
              {statusLabels[item.status] ?? item.status}
            </Text>
          </View>
        </View>
        <Text style={commonStyles.listCardSub}>
          Coût : {item.total_cost.toLocaleString("fr-FR")} €
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Chargement des réparations...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Réparations"
        subtitle="Suivi des interventions"
        onAdd={() =>
          Alert.alert(
            "Bientôt disponible",
            "L'ajout de réparations depuis l'app mobile arrive prochainement.",
          )
        }
      />
      <Searchbar
        placeholder="Rechercher une réparation..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
        inputStyle={styles.searchInput}
        iconColor={colors.textMuted}
        placeholderTextColor={colors.textDim}
      />
      <FlatList
        data={filteredRepairs}
        renderItem={renderRepair}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="build-outline" size={56} color={colors.textDim} />
            <Text style={commonStyles.emptyText}>Aucune réparation trouvée</Text>
          </View>
        }
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  search: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  searchInput: { color: colors.text },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.sm },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  flex: { flex: 1 },
  badge: { fontSize: 12, fontWeight: "700", marginTop: 4 },
  empty: { alignItems: "center", paddingVertical: 48 },
});
