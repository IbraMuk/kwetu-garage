import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenLayout from "../components/ScreenLayout";
import ScreenHeader from "../components/ScreenHeader";
import { apiService } from "../services/apiService";
import { orderService } from "../services/orderService";
import { colors, spacing } from "../theme";
import { formatMoney } from "../utils/apiHelpers";

interface Part {
  id: string;
  name: string;
  reference: string;
  description: string;
  price: number;
  stock_quantity: number;
}

interface CartItem extends Part {
  quantity: number;
}

export default function OrderScreen({ navigation }: any) {
  const [parts, setParts] = useState<Part[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const loadParts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getParts();
      setParts(data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les pièces");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  const filteredParts = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (part: Part) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === part.id);
      if (existing) {
        return prev.map((item) =>
          item.id === part.id
            ? { ...item, quantity: Math.min(item.quantity + 1, part.stock_quantity) }
            : item
        );
      }
      return [...prev, { ...part, quantity: 1 }];
    });
  };

  const removeFromCart = (partId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== partId));
  };

  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }
    const part = parts.find((p) => p.id === partId);
    if (!part) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === partId ? { ...item, quantity: Math.min(quantity, part.stock_quantity) } : item
      )
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = async () => {
    if (cart.length === 0) {
      Alert.alert("Erreur", "Votre panier est vide");
      return;
    }
    if (!clientName.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Erreur", "Veuillez remplir le nom, le téléphone et l'adresse de livraison");
      return;
    }

    setSubmitting(true);
    try {
      await orderService.create({
        client_name: clientName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        total_amount: totalAmount,
        items: cart.map((item) => ({
          part_id: item.id,
          part_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      });
      Alert.alert("Succès", "Votre commande a été passée avec succès !");
      setCart([]);
      setClientName("");
      setPhone("");
      setAddress("");
      setNotes("");
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de passer la commande"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderPart = ({ item }: { item: Part }) => {
    const inCart = cart.find((c) => c.id === item.id);
    return (
      <View style={styles.card}>
        <View style={styles.partInfo}>
          <Text style={styles.partName}>{item.name}</Text>
          <Text style={styles.partRef}>Réf: {item.reference}</Text>
          <Text style={styles.partPrice}>{formatMoney(item.price)}</Text>
          <Text style={styles.stock}>Stock: {item.stock_quantity}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, inCart && styles.addButtonActive]}
          onPress={() => addToCart(item)}
        >
          <Ionicons
            name={inCart ? "checkmark" : "add"}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenLayout>
      <ScreenHeader title="Commander" subtitle="Pièces & livraison à domicile" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Votre panier</Text>
          {cart.length === 0 ? (
            <Text style={styles.emptyText}>Aucune pièce sélectionnée</Text>
          ) : (
            cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>{formatMoney(item.price)}</Text>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={18} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatMoney(totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Livraison à domicile</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            placeholderTextColor={colors.textMuted}
            value={clientName}
            onChangeText={setClientName}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor={colors.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Adresse de livraison complète"
            placeholderTextColor={colors.textMuted}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes (optionnel)"
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={submitOrder}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Envoi en cours..." : "Passer la commande"}
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Catalogue de pièces</Text>
          <TextInput
            style={styles.input}
            placeholder="Rechercher une pièce..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {loading ? (
            <Text style={styles.emptyText}>Chargement...</Text>
          ) : (
            <FlatList
              data={filteredParts}
              keyExtractor={(item) => item.id}
              renderItem={renderPart}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Aucune pièce trouvée</Text>
              }
            />
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  card: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: spacing.md,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    color: colors.text,
    fontWeight: "600",
  },
  cartItemPrice: {
    color: colors.textMuted,
    fontSize: 13,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.xs,
  },
  quantity: {
    color: colors.text,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  totalLabel: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  totalAmount: {
    color: colors.primaryLight,
    fontWeight: "800",
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.backgroundMid,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    fontSize: 15,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  partRef: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  partPrice: {
    color: colors.primaryLight,
    fontWeight: "700",
    marginTop: 4,
  },
  stock: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  addButtonActive: {
    backgroundColor: colors.success,
  },
});
