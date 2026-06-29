import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiService } from "../services/apiService";
import { Client, Repair, Vehicle } from "../types";
import { colors, spacing } from "../theme";

type BaseModalProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

function FormModalShell({
  visible,
  title,
  onClose,
  children,
  onSubmit,
  saving,
  submitLabel = "Enregistrer",
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  onSubmit: () => void;
  saving: boolean;
  submitLabel?: string;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          <TouchableOpacity
            style={[styles.submitBtn, saving && styles.submitDisabled]}
            onPress={onSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.submitText}>{submitLabel}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

export function ClientFormModal({ visible, onClose, onSaved }: BaseModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isProfessional, setIsProfessional] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCompanyName("");
    setIsProfessional(false);
    setError("");
  }, [visible]);

  const submit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Prénom et nom sont obligatoires.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiService.createClient({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        company_name: companyName.trim() || undefined,
        is_professional: isProfessional,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModalShell
      visible={visible}
      title="Nouveau client"
      onClose={onClose}
      onSubmit={() => void submit()}
      saving={saving}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Field label="Prénom *" value={firstName} onChangeText={setFirstName} placeholder="Jean" />
      <Field label="Nom *" value={lastName} onChangeText={setLastName} placeholder="Dupont" />
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="email@exemple.com"
        keyboardType="email-address"
      />
      <Field
        label="Téléphone"
        value={phone}
        onChangeText={setPhone}
        placeholder="+221 77 000 00 00"
        keyboardType="phone-pad"
      />
      <Field
        label="Entreprise"
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Nom de l'entreprise"
      />
      <View style={styles.switchRow}>
        <Text style={styles.label}>Client professionnel</Text>
        <Switch
          value={isProfessional}
          onValueChange={setIsProfessional}
          trackColor={{ false: colors.glassBorder, true: colors.primary }}
        />
      </View>
    </FormModalShell>
  );
}

export function VehicleFormModal({ visible, onClose, onSaved }: BaseModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [plate, setPlate] = useState("");
  const [mileage, setMileage] = useState("0");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setMake("");
    setModel("");
    setYear(String(new Date().getFullYear()));
    setPlate("");
    setMileage("0");
    setError("");
    setLoadingClients(true);
    void apiService
      .getClients()
      .then((list) => {
        setClients(list);
        setClientId(list[0]?.id ?? "");
      })
      .catch(() => setClients([]))
      .finally(() => setLoadingClients(false));
  }, [visible]);

  const submit = async () => {
    if (!clientId) {
      setError("Créez d'abord un client.");
      return;
    }
    if (!make.trim() || !model.trim() || !plate.trim()) {
      setError("Marque, modèle et plaque sont obligatoires.");
      return;
    }
    const yearNum = parseInt(year, 10);
    if (!Number.isFinite(yearNum) || yearNum < 1900) {
      setError("Année invalide.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiService.createVehicle({
        client_id: clientId,
        make: make.trim(),
        model: model.trim(),
        year: yearNum,
        license_plate: plate.trim(),
        mileage: parseInt(mileage, 10) || 0,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModalShell
      visible={visible}
      title="Nouveau véhicule"
      onClose={onClose}
      onSubmit={() => void submit()}
      saving={saving}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.label}>Client *</Text>
      {loadingClients ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.sm }} />
      ) : clients.length === 0 ? (
        <Text style={styles.hint}>Aucun client — ajoutez un client d'abord.</Text>
      ) : (
        <View style={styles.picker}>
          {clients.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.pickerItem, clientId === c.id && styles.pickerItemActive]}
              onPress={() => setClientId(c.id)}
            >
              <Text
                style={[
                  styles.pickerText,
                  clientId === c.id && styles.pickerTextActive,
                ]}
              >
                {c.first_name} {c.last_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Field label="Marque *" value={make} onChangeText={setMake} placeholder="Toyota" />
      <Field label="Modèle *" value={model} onChangeText={setModel} placeholder="Corolla" />
      <Field label="Année *" value={year} onChangeText={setYear} keyboardType="numeric" />
      <Field label="Plaque *" value={plate} onChangeText={setPlate} placeholder="DK-1234-AB" />
      <Field label="Kilométrage" value={mileage} onChangeText={setMileage} keyboardType="numeric" />
    </FormModalShell>
  );
}

const REPAIR_STATUSES: Repair["status"][] = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
];

const statusLabels: Record<Repair["status"], string> = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

export function RepairFormModal({ visible, onClose, onSaved }: BaseModalProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Repair["status"]>("pending");
  const [totalCost, setTotalCost] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setDescription("");
    setStatus("pending");
    setTotalCost("");
    setError("");
    void apiService.getVehicles().then((list) => {
      setVehicles(list);
      setVehicleId(list[0]?.id ?? "");
    });
  }, [visible]);

  const submit = async () => {
    if (!vehicleId) {
      setError("Créez d'abord un véhicule.");
      return;
    }
    if (!description.trim()) {
      setError("La description est obligatoire.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiService.createRepair({
        vehicle_id: vehicleId,
        description: description.trim(),
        status,
        total_cost: parseFloat(totalCost.replace(/\s/g, "")) || 0,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModalShell
      visible={visible}
      title="Nouvelle réparation"
      onClose={onClose}
      onSubmit={() => void submit()}
      saving={saving}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.label}>Véhicule *</Text>
      {vehicles.length === 0 ? (
        <Text style={styles.hint}>Aucun véhicule — ajoutez un véhicule d'abord.</Text>
      ) : (
        <View style={styles.picker}>
          {vehicles.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.pickerItem, vehicleId === v.id && styles.pickerItemActive]}
              onPress={() => setVehicleId(v.id)}
            >
              <Text
                style={[
                  styles.pickerText,
                  vehicleId === v.id && styles.pickerTextActive,
                ]}
              >
                {v.make} {v.model} · {v.license_plate}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Field
        label="Description *"
        value={description}
        onChangeText={setDescription}
        placeholder="Vidange, freins..."
        multiline
      />
      <Text style={styles.label}>Statut</Text>
      <View style={styles.picker}>
        {REPAIR_STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.pickerItem, status === s && styles.pickerItemActive]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.pickerText, status === s && styles.pickerTextActive]}>
              {statusLabels[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Field
        label="Coût estimé (FCFA)"
        value={totalCost}
        onChangeText={setTotalCost}
        keyboardType="numeric"
        placeholder="45000"
      />
    </FormModalShell>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.backgroundMid,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: colors.text },
  field: { marginHorizontal: spacing.md, marginBottom: spacing.md },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 6,
    marginHorizontal: spacing.md,
  },
  input: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
  },
  inputMulti: { minHeight: 88 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  submitBtn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: colors.text, fontWeight: "800", fontSize: 16 },
  error: {
    color: colors.error,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 14,
  },
  hint: {
    color: colors.textDim,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    fontSize: 14,
  },
  picker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
  },
  pickerItemActive: {
    borderColor: colors.primaryLight,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  pickerText: { color: colors.textMuted, fontSize: 13 },
  pickerTextActive: { color: colors.primaryLight, fontWeight: "700" },
});
