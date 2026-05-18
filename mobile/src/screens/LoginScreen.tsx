import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
import ScreenLayout from "../components/ScreenLayout";
import { authService, LoginCredentials, mapAuthUserToStorage } from "../services/authService";
import { storageService } from "../services/storageService";
import { colors, commonStyles, spacing } from "../theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await storageService.isLoggedIn();
      const token = await storageService.getToken();
      if (isLoggedIn && token) {
        navigation.reset({ index: 0, routes: [{ name: "Tabs" as never }] });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await authService.login(credentials);
      await storageService.setToken(response.token);
      await storageService.setUserInfo(mapAuthUserToStorage(response.user));
      await storageService.setLoggedIn(true);
      navigation.reset({ index: 0, routes: [{ name: "Tabs" as never }] });
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de se connecter",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Erreur", "Veuillez entrer votre email");
      return;
    }
    try {
      await authService.forgotPassword(email);
      Alert.alert("Succès", "Un email de réinitialisation a été envoyé");
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Impossible de demander la réinitialisation",
      );
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
              <Ionicons name="car-sport" size={56} color={colors.primaryLight} />
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

            <TouchableOpacity style={styles.forgot} onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.9}
            >
              <Ionicons name="construct" size={22} color={colors.text} style={styles.btnIcon} />
              <Text style={styles.loginBtnText}>
                {loading ? "Connexion en cours..." : "Accéder au garage"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoCard}>
            <Text style={styles.demoTitle}>Accès démonstration</Text>
            <View style={styles.demoRow}>
              <Text style={styles.demoLabel}>Email</Text>
              <Text style={styles.demoValue}>admin@kwetugarage.com</Text>
            </View>
            <View style={styles.demoRow}>
              <Text style={styles.demoLabel}>Mot de passe</Text>
              <Text style={styles.demoValue}>password123</Text>
            </View>
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
  forgot: { alignSelf: "flex-end", marginBottom: spacing.lg },
  forgotText: { color: colors.primaryLight, fontWeight: "700", fontSize: 14 },
  loginBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
  },
  loginBtnDisabled: { opacity: 0.6 },
  btnIcon: { marginRight: spacing.sm },
  loginBtnText: { color: colors.text, fontSize: 16, fontWeight: "800" },
  demoCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.25)",
  },
  demoTitle: {
    textAlign: "center",
    color: colors.textSecondary,
    fontWeight: "700",
    marginBottom: spacing.md,
    fontSize: 13,
  },
  demoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    backgroundColor: colors.glass,
    padding: spacing.sm,
    borderRadius: 12,
  },
  demoLabel: { color: colors.textMuted, fontSize: 12 },
  demoValue: {
    color: colors.primaryLight,
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  footer: {
    textAlign: "center",
    marginTop: spacing.xl,
    fontSize: 12,
    color: colors.textDim,
  },
});
