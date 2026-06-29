import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";

const services = [
  { icon: "construct", title: "Mécanique", desc: "Diagnostic & réparation" },
  { icon: "color-palette", title: "Carrosserie", desc: "Peinture & tôlerie" },
  { icon: "flash", title: "Électricité", desc: "Batterie & électronique" },
  { icon: "cube", title: "Pièces", desc: "Vente de pièces détachées" },
];

const stats = [
  { value: "15+", label: "Années d'expérience" },
  { value: "5 000+", label: "Véhicules réparés" },
  { value: "98%", label: "Clients satisfaits" },
];

export default function LandingScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brand}>
            Kwetu <Text style={styles.brandHighlight}>Garage</Text>
          </Text>
          <Text style={styles.tagline}>
            L'excellence automobile au service de votre véhicule
          </Text>

          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Accéder à mon garage</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nos services</Text>
          <View style={styles.grid}>
            {services.map((service) => (
              <View key={service.title} style={styles.card}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={service.icon as any}
                    size={24}
                    color={colors.primaryLight}
                  />
                </View>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardDesc}>{service.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About teaser */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pourquoi Kwetu Garage ?</Text>
          {[
            "Mécaniciens certifiés multimarques",
            "Devis gratuit et transparent",
            "Suivi de vos réparations en ligne",
            "Service rapide et garanti",
          ].map((item) => (
            <View key={item} style={styles.bullet}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="location" size={20} color={colors.primaryLight} />
              <Text style={styles.contactText}>Kinshasa, RDC</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={20} color={colors.primaryLight} />
              <Text style={styles.contactText}>+243 000 000 000</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={20} color={colors.primaryLight} />
              <Text style={styles.contactText}>contact@kwetugarage.com</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>© {new Date().getFullYear()} Kwetu Garage</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  hero: {
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  brandHighlight: {
    color: colors.primaryLight,
  },
  tagline: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.lg,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primaryLight,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%",
  },
  primaryBtnText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  card: {
    width: "47%",
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textMuted,
  },
  bullet: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bulletText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  contactCard: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    textAlign: "center",
    color: colors.textDim,
    fontSize: 12,
    marginTop: spacing.md,
  },
});
