import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import { useAuth } from "../contexts/AuthContext";
import { colors, commonStyles, spacing } from "../theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const credentials = { email: email.trim(), password };
      console.log("Tentative de connexion avec:", credentials.email);
      await login(credentials);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert(
        "Erreur de connexion",
        error instanceof Error ? error.message : "Impossible de se connecter"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoRing}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brand}>Kwetu Garage</Text>
            <Text style={styles.tagline}>La gestion de garage, réinventée</Text>
            <Text style={styles.welcome}>Bon retour !</Text>
            <Text style={styles.hint}>Connectez-vous pour gérer votre garage</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={commonStyles.label}>Adresse email</Text>
            <View style={commonStyles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[commonStyles.input, styles.inputPad]}
                placeholder="admin@kwetugarage.com"
                placeholderTextColor={colors.textDim}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={commonStyles.label}>Mot de passe</Text>
            <View style={commonStyles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[commonStyles.input, styles.inputPad]}
                placeholder="••••••••"
                placeholderTextColor={colors.textDim}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <Text style={styles.loginBtnText}>Connexion en cours...</Text>
              ) : (
                <>
                  <Ionicons name="construct" size={22} color={colors.text} style={styles.btnIcon} />
                  <Text style={styles.loginBtnText}>Accéder à mon garage</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>© 2024 Kwetu Garage</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: { alignItems: "center", marginBottom: spacing.lg },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primaryLight,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  hint: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  formCard: {
    ...commonStyles.glassCard,
    padding: spacing.lg,
    borderRadius: 24,
  },
  inputPad: { marginLeft: spacing.sm },
  loginBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  loginBtnDisabled: { opacity: 0.6 },
  btnIcon: { marginRight: spacing.sm },
  loginBtnText: { color: colors.text, fontSize: 16, fontWeight: "800" },
  footer: {
    textAlign: "center",
    marginTop: spacing.xl,
    fontSize: 12,
    color: colors.textDim,
  },
});
