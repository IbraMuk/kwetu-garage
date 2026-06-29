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
import ScreenHeader from "../components/ScreenHeader";
import ScreenLayout from "../components/ScreenLayout";
import { apiService } from "../services/apiService";
import { Part } from "../types";
import { formatNumber } from "../utils/apiHelpers";
import { colors, commonStyles, spacing } from "../theme";

export default function PartsScreen() {
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadParts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setParts(await apiService.getParts());
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de charger les pièces",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadParts(true);
    }, [loadParts]),
  );

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredParts(
      parts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.reference && p.reference.toLowerCase().includes(q)),
      ),
    );
  }, [parts, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setParts(await apiService.getParts());
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Impossible de rafraîchir");
    } finally {
      setRefreshing(false);
    }
  };

  const showPartDetails = (part: Part) => {
    const stockStatus = part.stock_quantity <= part.min_stock_level 
      ? "Stock bas" 
      : part.stock_quantity <= part.min_stock_level * 2 
      ? "Stock limité" 
      : "En stock";

    Alert.alert(
      part.name,
      `Référence : ${part.reference || "N/A"}\nPrix : ${formatNumber(part.price)} €\nStock : ${part.stock_quantity}\nStock minimum : ${part.min_stock_level}\nStatut : ${stockStatus}`,
      [
        { text: "Fermer", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert("Confirmer", "Supprimer cette pièce ?", [
              { text: "Annuler", style: "cancel" },
              {
                text: "Supprimer",
                style: "destructive",
                onPress: () =>
                  void (async () => {
                    try {
                      await apiService.deletePart(part.id);
                      await loadParts(true);
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

  const getStockStatusColor = (part: Part) => {
    if (part.stock_quantity <= part.min_stock_level) return colors.error;
    if (part.stock_quantity <= part.min_stock_level * 2) return colors.warning;
    return colors.success;
  };

  const renderPart = ({ item }: { item: Part }) => (
    <TouchableOpacity
      style={commonStyles.listCard}
      onPress={() => showPartDetails(item)}
      activeOpacity={0.85}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${getStockStatusColor(item)}20` }]}>
          <Ionicons name="cube" size={22} color={getStockStatusColor(item)} />
        </View>
        <View style={styles.flex}>
          <Text style={commonStyles.listCardTitle}>{item.name}</Text>
          {item.reference && (
            <Text style={styles.reference}>{item.reference}</Text>
          )}
        </View>
      </View>
      <View style={styles.meta}>
        <Text style={commonStyles.listCardSub}>{formatNumber(item.price)} €</Text>
        <Text style={[commonStyles.listCardSub, { color: getStockStatusColor(item) }]}>
          Stock: {item.stock_quantity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && parts.length === 0) {
    return (
      <ScreenLayout>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Chargement des pièces...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Pièces"
        subtitle="Stock de pièces"
      />
      <Searchbar
        placeholder="Rechercher une pièce..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
        inputStyle={styles.searchInput}
        iconColor={colors.textMuted}
        placeholderTextColor={colors.textDim}
      />
      <FlatList
        data={filteredParts}
        renderItem={renderPart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={56} color={colors.textDim} />
            <Text style={commonStyles.emptyText}>Aucune pièce trouvée</Text>
            <Text style={commonStyles.emptySubtext}>
              {searchQuery ? "Essayez une autre recherche" : "Ajoutez votre première pièce"}
            </Text>
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
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  flex: { flex: 1 },
  reference: { fontSize: 14, color: colors.primaryLight, fontWeight: "700", marginTop: 2 },
  meta: { gap: 4 },
  empty: { alignItems: "center", paddingVertical: 48 },
});
