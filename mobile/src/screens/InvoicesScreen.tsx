import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Print from "expo-print";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
import ScreenHeader from "../components/ScreenHeader";
import ScreenLayout from "../components/ScreenLayout";
import { apiService } from "../services/apiService";
import { Client, Invoice } from "../types";
import { formatNumber } from "../utils/apiHelpers";
import { colors, commonStyles, spacing } from "../theme";

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(false);

  const [clientId, setClientId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Invoice["status"]>("pending");

  const loadInvoices = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [invoiceData, clientData] = await Promise.all([
        apiService.getInvoices(),
        apiService.getClients(),
      ]);
      setInvoices(invoiceData);
      setClients(clientData);
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
      invoices.filter((i) => i.invoice_number.toLowerCase().includes(q)),
    );
  }, [invoices, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInvoices(true);
    } catch (error) {
      Alert.alert("Erreur", error instanceof Error ? error.message : "Impossible de rafraîchir");
    } finally {
      setRefreshing(false);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : clientId;
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

  const createInvoice = async () => {
    if (!clientId) {
      Alert.alert("Erreur", "Veuillez sélectionner un client");
      return;
    }
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      Alert.alert("Erreur", "Veuillez entrer un montant valide");
      return;
    }

    setSubmitting(true);
    try {
      await apiService.createInvoice({
        client_id: clientId,
        total_amount: parseFloat(totalAmount),
        due_date: dueDate || undefined,
        status,
      });
      Alert.alert("Succès", "Facture créée avec succès");
      setModalVisible(false);
      setClientId("");
      setTotalAmount("");
      setDueDate("");
      setStatus("pending");
      await loadInvoices(true);
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de créer la facture",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const viewPdf = async (invoice: Invoice) => {
    try {
      setViewingPdf(true);
      await Print.printAsync({
        uri: `${apiService.getBaseUrl()}/invoices/${invoice.id}/pdf`,
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible d'ouvrir le PDF",
      );
    } finally {
      setViewingPdf(false);
    }
  };

  const showInvoiceDetails = (invoice: Invoice) => {
    Alert.alert(
      `Facture ${invoice.invoice_number}`,
      `Client: ${getClientName(invoice.client_id)}\nMontant: ${formatNumber(invoice.total_amount)} $\nStatut: ${getStatusText(invoice.status)}\nDate d'émission: ${new Date(invoice.issue_date).toLocaleDateString('fr-FR')}`,
      [
        { text: "Fermer", style: "cancel" },
        {
          text: "Voir PDF",
          onPress: () => void viewPdf(invoice),
        },
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
          <Text style={styles.client}>{getClientName(item.client_id)}</Text>
        </View>
        <TouchableOpacity
          style={styles.pdfButton}
          onPress={() => void viewPdf(item)}
          disabled={viewingPdf}
        >
          <Ionicons name="eye" size={20} color={colors.primaryLight} />
        </TouchableOpacity>
      </View>
      <View style={styles.meta}>
        <Text style={commonStyles.listCardSub}>{formatNumber(item.total_amount)} $</Text>
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
        onAdd={() => setModalVisible(true)}
        addLabel="Nouvelle"
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

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle facture</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Client</Text>
            <View style={styles.clientList}>
              {clients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={[
                    styles.clientChip,
                    clientId === client.id && styles.clientChipActive,
                  ]}
                  onPress={() => setClientId(client.id)}
                >
                  <Text
                    style={[
                      styles.clientChipText,
                      clientId === client.id && styles.clientChipTextActive,
                    ]}
                  >
                    {client.first_name} {client.last_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Montant total ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={totalAmount}
              onChangeText={setTotalAmount}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Date d'échéance (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              value={dueDate}
              onChangeText={setDueDate}
            />

            <Text style={styles.label}>Statut</Text>
            <View style={styles.statusRow}>
              {(["pending", "paid", "overdue", "cancelled"] as Invoice["status"][]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusChip, status === s && styles.statusChipActive]}
                  onPress={() => setStatus(s)}
                >
                  <Text style={[styles.statusChipText, status === s && styles.statusChipTextActive]}>
                    {getStatusText(s)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={() => void createInvoice()}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? "Création..." : "Créer la facture"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  pdfButton: {
    padding: spacing.sm,
  },
  empty: { alignItems: "center", paddingVertical: 48 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.backgroundMid,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  label: {
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
  clientList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  clientChip: {
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clientChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  clientChipText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  clientChipTextActive: {
    color: colors.text,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusChip: {
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusChipText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  statusChipTextActive: {
    color: colors.text,
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
});
