import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { assistanceService, IssueType } from "../services/assistanceService";
import { colors, spacing } from "../theme";

export default function AssistanceScreen() {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [issueType, setIssueType] = useState<IssueType>("breakdown");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitRequest = async () => {
    if (!clientName.trim() || !phone.trim() || !location.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSubmitting(true);
    try {
      await assistanceService.create({
        client_name: clientName.trim(),
        phone: phone.trim(),
        location: location.trim(),
        issue_type: issueType,
        description: description.trim(),
      });
      Alert.alert(
        "Demande envoyée",
        "Notre équipe vous contactera rapidement pour vous aider."
      );
      setClientName("");
      setPhone("");
      setLocation("");
      setDescription("");
      setIssueType("breakdown");
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible d'envoyer la demande"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const issueOptions: { value: IssueType; label: string; icon: any }[] = [
    { value: "breakdown", label: "Dépannage sur place", icon: "build" },
    { value: "towing", label: "Remorquage", icon: "car" },
  ];

  return (
    <ScreenLayout>
      <ScreenHeader
        title="Dépannage"
        subtitle="Assistance instantanée 24h/24"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.emergencyCard}>
            <Ionicons name="call" size={28} color={colors.error} />
            <Text style={styles.emergencyText}>
              En cas d'urgence, appelez-nous directement au{" "}
              <Text style={styles.emergencyPhone}>+243 000 000 000</Text>
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Type d'intervention</Text>
            <View style={styles.optionsRow}>
              {issueOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    issueType === option.value && styles.optionButtonActive,
                  ]}
                  onPress={() => setIssueType(option.value)}
                >
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={issueType === option.value ? colors.text : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      issueType === option.value && styles.optionLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Vos informations</Text>
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
              placeholder="Votre localisation actuelle"
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={setLocation}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Décrivez le problème (optionnel)"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={submitRequest}
            disabled={submitting}
          >
            <Ionicons name="navigate" size={20} color={colors.text} />
            <Text style={styles.submitButtonText}>
              {submitting ? "Envoi en cours..." : "Demander une intervention"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  emergencyText: {
    flex: 1,
    color: colors.text,
    marginLeft: spacing.md,
    fontSize: 14,
    lineHeight: 20,
  },
  emergencyPhone: {
    color: colors.error,
    fontWeight: "700",
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
  optionsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.backgroundMid,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.md,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLabel: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 14,
  },
  optionLabelActive: {
    color: colors.text,
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
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.error,
    borderRadius: 16,
    padding: spacing.md,
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
});
