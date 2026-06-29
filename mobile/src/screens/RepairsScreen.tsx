import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
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
import { RepairFormModal } from "../components/EntityFormModals";
import ScreenHeader from "../components/ScreenHeader";
import ScreenLayout from "../components/ScreenLayout";
import { apiService } from "../services/apiService";
import { Repair } from "../types";
import { formatMoney } from "../utils/apiHelpers";
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

export default function RepairsScreen() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const loadRepairs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setRepairs(await apiService.getRepairs());
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de charger les réparations",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRepairs(true);
    }, [loadRepairs]),
  );

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

  const showRepairDetails = (item: Repair) => {
    Alert.alert(
      item.description,
      `Statut : ${statusLabels[item.status] ?? item.status}\nCoût : ${formatMoney(item.total_cost)}`,
      [
        { text: "Fermer", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert("Confirmer", "Supprimer cette réparation ?", [
              { text: "Annuler", style: "cancel" },
              {
                text: "Supprimer",
                style: "destructive",
                onPress: () =>
                  void (async () => {
                    try {
                      await apiService.deleteRepair(item.id);
                      await loadRepairs(true);
                    } catch (e) {
                      Alert.alert(
                        "Erreur",
                        e instanceof Error ? e.message : "Suppression impossible",
                      );
                    }
                  })(),
              },
            ]);
          },
        },
      ],
    );
  };

  const renderRepair = ({ item }: { item: Repair }) => {
    const statusColor = statusColors[item.status] ?? colors.textMuted;
    return (
      <TouchableOpacity
        style={commonStyles.listCard}
        onPress={() => showRepairDetails(item)}
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
        <Text style={commonStyles.listCardSub}>Coût : {formatMoney(item.total_cost)}</Text>
      </TouchableOpacity>
    );
  };

  if (loading && repairs.length === 0) {
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
        onAdd={() => setFormVisible(true)}
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
      <RepairFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSaved={() => void loadRepairs(true)}
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
