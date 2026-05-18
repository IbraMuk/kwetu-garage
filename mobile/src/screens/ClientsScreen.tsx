import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
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
import { Client } from "../types";
import { colors, commonStyles, spacing } from "../theme";

export default function ClientsScreen({ navigation }: any) {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredClients(
      clients.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.last_name.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.company_name?.toLowerCase().includes(q),
      ),
    );
  }, [clients, searchQuery]);

  const loadClients = async () => {
    try {
      const data = await apiService.getClients();
      setClients(data);
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de charger les clients",
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  const showClientDetails = (client: Client) => {
    Alert.alert(
      `${client.first_name} ${client.last_name}`,
      [
        client.email,
        client.phone,
        client.company_name,
        client.is_professional ? "Client professionnel" : "Particulier",
      ]
        .filter(Boolean)
        .join("\n") || "Aucune information supplémentaire",
    );
  };

  const renderClient = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={commonStyles.listCard}
      onPress={() => showClientDetails(item)}
      activeOpacity={0.85}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons
            name={item.is_professional ? "business" : "person"}
            size={22}
            color={colors.primaryLight}
          />
        </View>
        <View style={styles.info}>
          <Text style={commonStyles.listCardTitle}>
            {item.first_name} {item.last_name}
          </Text>
          {item.email ? <Text style={commonStyles.listCardSub}>{item.email}</Text> : null}
          {item.phone ? <Text style={commonStyles.listCardSub}>{item.phone}</Text> : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Clients"
        subtitle="Gestion de la clientèle"
        onAdd={() =>
          Alert.alert(
            "Bientôt disponible",
            "L'ajout de clients depuis l'app mobile arrive prochainement. Utilisez la version web en attendant.",
          )
        }
      />
      <Searchbar
        placeholder="Rechercher un client..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
        inputStyle={styles.searchInput}
        iconColor={colors.textMuted}
        placeholderTextColor={colors.textDim}
      />
      <FlatList
        data={filteredClients}
        renderItem={renderClient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={56} color={colors.textDim} />
            <Text style={commonStyles.emptyText}>Aucun client trouvé</Text>
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
  row: { flexDirection: "row", alignItems: "center" },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  empty: { alignItems: "center", paddingVertical: 48 },
});
