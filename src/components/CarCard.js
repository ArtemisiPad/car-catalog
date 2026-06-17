import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS } from "../utils/theme";
import { RARITY_CONFIG, formatPrice } from "../data/cars";

export default function CarCard({ car, onPress, isCustom }) {
  const cfg = RARITY_CONFIG[car.rarity] || RARITY_CONFIG.common;
  const brand = car.name.split(" ")[0];
  return (
    <TouchableOpacity style={[styles.card, { borderColor: cfg.color + "55" }]} onPress={() => onPress && onPress(car)} activeOpacity={0.75}>
      <View style={[styles.accentBar, { backgroundColor: cfg.color }]} />
      <View style={[styles.iconBox, { backgroundColor: cfg.glow }]}>
        <Text style={[styles.iconText, { color: cfg.color }]}>{brand.slice(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{car.name}</Text>
        <View style={styles.row}>
          <View style={[styles.rarityBadge, { backgroundColor: cfg.glow, borderColor: cfg.color + "66" }]}>
            <Text style={[styles.rarityText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          {isCustom && (
            <View style={styles.customBadge}>
              <Text style={styles.customText}>МОЯ</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.priceBox}>
        <Text style={styles.priceLabel}>ЦЕНА</Text>
        <Text style={[styles.price, { color: cfg.color }]}>{formatPrice(car.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bgCard, borderWidth: 1, borderRadius: RADIUS.md, marginHorizontal: SPACING.lg, marginVertical: SPACING.xs, overflow: "hidden", paddingVertical: SPACING.md, paddingRight: SPACING.lg },
  accentBar: { width: 3, alignSelf: "stretch", marginRight: SPACING.md, borderRadius: 2 },
  iconBox: { width: 44, height: 44, borderRadius: RADIUS.sm, alignItems: "center", justifyContent: "center", marginRight: SPACING.md },
  iconText: { fontSize: 14, fontWeight: "900", letterSpacing: 1 },
  info: { flex: 1, gap: SPACING.xs },
  name: { color: COLORS.textPrimary, fontSize: 14, fontWeight: "700", letterSpacing: 0.3 },
  row: { flexDirection: "row", gap: SPACING.xs, alignItems: "center" },
  rarityBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full, borderWidth: 1 },
  rarityText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  customBadge: { backgroundColor: COLORS.accentDim, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.accent + "66" },
  customText: { color: COLORS.accent, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  priceBox: { alignItems: "flex-end", marginLeft: SPACING.sm },
  priceLabel: { color: COLORS.textMuted, fontSize: 9, fontWeight: "600", letterSpacing: 1.5 },
  price: { fontSize: 16, fontWeight: "900", letterSpacing: 0.5 },
});
