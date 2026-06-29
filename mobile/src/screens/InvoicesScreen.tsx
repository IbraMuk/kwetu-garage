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
import { Invoice } from "../types";
import { formatNumber } from "../utils/apiHelpers";
import { colors, commonStyles, spacing } from "../theme";

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInvoices = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setInvoices(await apiService.getInvoices());
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de charger les factures",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadInvoices(true);
    }, [loadInvoices]),
  );

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredInvoices(
      invoices.filter(
        (i) =>
          i.invoice_number.toLowerCase().includes(q),
      ),
    );
  }, [invoices, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setInvoices(await apiService.getInvoices());
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Impossible de rafraîchir");
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "En attente";
      case "paid": return "Payée";
      case "overdue": return "En retard";
      case "cancelled": return "Annulée";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return colors.warning;
      case "paid": return colors.success;
      case "overdue": return colors.error;
      case "cancelled": return colors.textDim;
      default: return colors.textDim;
    }
  };

  const showInvoiceDetails = (invoice: Invoice) => {
    Alert.alert(
      `Facture ${invoice.invoice_number}`,
      `Client ID: ${invoice.client_id}\nMontant: ${formatNumber(invoice.total_amount)} €\nStatut: ${getStatusText(invoice.status)}\nDate d'émission: ${new Date(invoice.issue_date).toLocaleDateString('fr-FR')}`,
      [
        { text: "Fermer", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert("Confirmer", "Supprimer cette facture ?", [
              { text: "Annuler", style: "cancel" },
              {
                text: "Supprimer",
                style: "destructive",
                onPress: () =>
                  void (async () => {
                    try {
                      await apiService.deleteInvoice(invoice.id);
                      await loadInvoices(true);
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

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      style={commonStyles.listCard}
      onPress={() => showInvoiceDetails(item)}
      activeOpacity={0.85}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Ionicons name="document-text" size={22} color={getStatusColor(item.status)} />
        </View>
        <View style={styles.flex}>
          <Text style={commonStyles.listCardTitle}>{item.invoice_number}</Text>
          <Text style={styles.client}>Client ID: {item.client_id}</Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Text style={commonStyles.listCardSub}>{formatNumber(item.total_amount)} €</Text>
        <Text style={[commonStyles.listCardSub, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && invoices.length === 0) {
    return (
      <ScreenLayout>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Chargement des factures...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Factures"
        subtitle="Gestion des factures"
      />
      <Searchbar
        placeholder="Rechercher une facture..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
        inputStyle={styles.searchInput}
        iconColor={colors.textMuted}
        placeholderTextColor={colors.textDim}
      />
      <FlatList
        data={filteredInvoices}
        renderItem={renderInvoice}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={56} color={colors.textDim} />
            <Text style={commonStyles.emptyText}>Aucune facture trouvée</Text>
            <Text style={commonStyles.emptySubtext}>
              {searchQuery ? "Essayez une autre recherche" : "Créez votre première facture"}
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
  client: { fontSize: 14, color: colors.primaryLight, fontWeight: "700", marginTop: 2 },
  meta: { gap: 4 },
  empty: { alignItems: "center", paddingVertical: 48 },
});
