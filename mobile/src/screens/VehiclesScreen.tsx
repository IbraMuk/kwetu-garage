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
import { VehicleFormModal } from "../components/EntityFormModals";
import ScreenHeader from "../components/ScreenHeader";
import ScreenLayout from "../components/ScreenLayout";
import { apiService } from "../services/apiService";
import { Vehicle } from "../types";
import { formatNumber } from "../utils/apiHelpers";
import { colors, commonStyles, spacing } from "../theme";

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const loadVehicles = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setVehicles(await apiService.getVehicles());
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de charger les véhicules",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadVehicles(true);
    }, [loadVehicles]),
  );

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredVehicles(
      vehicles.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          (v.license_plate ?? "").toLowerCase().includes(q),
      ),
    );
  }, [vehicles, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setVehicles(await apiService.getVehicles());
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Impossible de rafraîchir");
    } finally {
      setRefreshing(false);
    }
  };

  const showVehicleDetails = (vehicle: Vehicle) => {
    Alert.alert(
      `${vehicle.make} ${vehicle.model}`,
      `Plaque : ${vehicle.license_plate}\nAnnée : ${vehicle.year}\nKilométrage : ${formatNumber(vehicle.mileage)} km`,
      [
        { text: "Fermer", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert("Confirmer", "Supprimer ce véhicule ?", [
              { text: "Annuler", style: "cancel" },
              {
                text: "Supprimer",
                style: "destructive",
                onPress: () =>
                  void (async () => {
                    try {
                      await apiService.deleteVehicle(vehicle.id);
                      await loadVehicles(true);
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

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={commonStyles.listCard}
      onPress={() => showVehicleDetails(item)}
      activeOpacity={0.85}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="car" size={22} color={colors.primaryLight} />
        </View>
        <View style={styles.flex}>
          <Text style={commonStyles.listCardTitle}>
            {item.make} {item.model}
          </Text>
          <Text style={styles.plate}>{item.license_plate}</Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Text style={commonStyles.listCardSub}>Année {item.year}</Text>
        <Text style={commonStyles.listCardSub}>{formatNumber(item.mileage)} km</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && vehicles.length === 0) {
    return (
      <ScreenLayout>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Chargement des véhicules...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Véhicules"
        subtitle="Parc automobile"
        onAdd={() => setFormVisible(true)}
      />
      <Searchbar
        placeholder="Rechercher un véhicule..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
        inputStyle={styles.searchInput}
        iconColor={colors.textMuted}
        placeholderTextColor={colors.textDim}
      />
      <FlatList
        data={filteredVehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="car-outline" size={56} color={colors.textDim} />
            <Text style={commonStyles.emptyText}>Aucun véhicule trouvé</Text>
            <Text style={commonStyles.emptySubtext}>
              {searchQuery ? "Essayez une autre recherche" : "Ajoutez votre premier véhicule"}
            </Text>
          </View>
        }
      />
      <VehicleFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSaved={() => void loadVehicles(true)}
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
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  flex: { flex: 1 },
  plate: { fontSize: 14, color: colors.primaryLight, fontWeight: "700", marginTop: 2 },
  meta: { gap: 4 },
  empty: { alignItems: "center", paddingVertical: 48 },
});
