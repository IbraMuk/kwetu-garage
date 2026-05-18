import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

type ScreenLayoutProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "right" | "bottom" | "left")[];
};

export default function ScreenLayout({
  children,
  style,
  edges = ["top", "left", "right"],
}: ScreenLayoutProps) {
  return (
    <View style={styles.root}>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
      <SafeAreaView style={[styles.safe, style]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  blobTop: {
    position: "absolute",
    top: -80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(37, 99, 235, 0.18)",
  },
  blobBottom: {
    position: "absolute",
    bottom: 100,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(139, 92, 246, 0.12)",
  },
  safe: {
    flex: 1,
  },
});
