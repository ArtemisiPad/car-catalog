import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { COLORS, SPACING, RADIUS } from "../utils/theme";
import { RARITY_CONFIG, RARITIES } from "../data/cars";

export default function AddCarModal({ visible, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rarity, setRarity] = useState("common");

  const handleAdd = () => {
    if (!name.trim() || !price.trim()) return;
    const priceNum = parseInt(price.replace(/\s/g, ""), 10);
    if (isNaN(priceNum) || priceNum <= 0) return;
    onAdd({ name: name.trim(), price: priceNum, rarity });
    setName(""); setPrice(""); setRarity("common");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>ДОБАВИТЬ МАШИНУ</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>НАЗВАНИЕ</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Например: BMW M5 F90" placeholderTextColor={COLORS.textMuted} selectionColor={COLORS.accent} />
          <Text style={styles.label}>ЦЕНА (монет)</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Например: 1500000" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" selectionColor={COLORS.accent} />
          <Text style={styles.label}>РЕДКОСТЬ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.xl }} contentContainerStyle={{ flexDirection: "row", gap: SPACING.sm, paddingVertical: SPACING.sm }}>
            {RARITIES.map(r => {
              const cfg = RARITY_CONFIG[r];
              const active = rarity === r;
              return (
                <TouchableOpacity key={r} style={[styles.rarityBtn, { borderColor: cfg.color + (active ? "FF" : "44") }, active && { backgroundColor: cfg.glow }]} onPress={() => setRarity(r)}>
                  <Text style={[styles.rarityBtnText, { color: active ? cfg.color : COLORS.textSecondary }]}>{cfg.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>ОТМЕНА</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addBtn, (!name.trim() || !price.trim()) && { opacity: 0.4 }]} onPress={handleAdd}>
              <Text style={styles.addText}>ДОБАВИТЬ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "#000000BB" },
  sheet: { backgroundColor: COLORS.bgModal, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderColor: "#1E1E2E" },
  handle: { width: 40, height: 4, backgroundColor: "#1E1E2E", borderRadius: 2, alignSelf: "center", marginBottom: SPACING.xl },
  title: { color: COLORS.accent, fontSize: 18, fontWeight: "900", letterSpacing: 3, textAlign: "center", marginBottom: SPACING.lg },
  divider: { height: 1, backgroundColor: "#1E1E2E", marginBottom: SPACING.xl },
  label: { color: COLORS.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 2, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  input: { backgroundColor: COLORS.bgInput, borderWidth: 1, borderColor: "#1E1E2E", borderRadius: RADIUS.md, padding: SPACING.md, color: COLORS.textPrimary, fontSize: 15, fontWeight: "600", marginBottom: SPACING.sm },
  rarityBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 999, borderWidth: 1 },
  rarityBtnText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  btnRow: { flexDirection: "row", gap: SPACING.md },
  cancelBtn: { flex: 1, padding: SPACING.lg, borderRadius: RADIUS.md, borderWidth: 1, borderColor: "#1E1E2E", alignItems: "center" },
  cancelText: { color: COLORS.textSecondary, fontWeight: "700", letterSpacing: 1.5, fontSize: 13 },
  addBtn: { flex: 2, padding: SPACING.lg, borderRadius: RADIUS.md, backgroundColor: COLORS.accent, alignItems: "center" },
  addText: { color: COLORS.bg, fontWeight: "900", letterSpacing: 2, fontSize: 13 },
});
