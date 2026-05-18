import { StyleSheet } from "react-native";

export const colors = {
  background: "#0f172a",
  backgroundMid: "#1e293b",
  primary: "#3b82f6",
  primaryDark: "#2563eb",
  primaryLight: "#60a5fa",
  accent: "#8b5cf6",
  text: "#ffffff",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  glass: "rgba(255, 255, 255, 0.1)",
  glassBorder: "rgba(255, 255, 255, 0.2)",
  glassStrong: "rgba(255, 255, 255, 0.15)",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  emerald: "#34d399",
  tabBar: "rgba(15, 23, 42, 0.95)",
  tabBarBorder: "rgba(255, 255, 255, 0.1)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const theme = {
  colors,
  spacing,
  roundness: 16,
};

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  glassCard: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.glass,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textMuted,
  },
  listCard: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  listCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  listCardSub: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textDim,
    marginTop: spacing.sm,
    textAlign: "center",
  },
});

export const paperTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.background,
    surface: colors.glass,
    elevation: { level0: "transparent" },
    onSurface: colors.text,
    onSurfaceVariant: colors.textMuted,
    outline: colors.glassBorder,
  },
} as const;
