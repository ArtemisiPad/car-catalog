import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, StatusBar, ScrollView, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SPACING, RADIUS } from "../utils/theme";
import { ALL_CARS, RARITY_CONFIG, RARITIES, getBrands } from "../data/cars";
import CarCard from "../components/CarCard";
import AddCarModal from "../components/AddCarModal";

const STORAGE_KEY = "@custom_cars";

export default function CatalogScreen() {
  const [search, setSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("Все");
  const [customCars, setCustomCars] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const brands = useMemo(() => getBrands(), []);

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setCustomCars(JSON.parse(data));
      setLoaded(true);
    });
  }, []);

  const saveCustomCars = async (cars) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  };

  const handleAddCar = (car) => {
    const updated = [{ ...car, isCustom: true }, ...customCars];
    setCustomCars(updated);
    saveCustomCars(updated);
  };

  const allCars = useMemo(() => [
    ...customCars.map(c => ({ ...c, isCustom: true })),
    ...ALL_CARS,
  ], [customCars]);

  const filtered = useMemo(() => {
    return allCars.filter(car => {
      const matchSearch = car.name.toLowerCase().includes(search.toLowerCase());
      const matchRarity = selectedRarity === "all" || car.rarity === selectedRarity;
      const matchBrand = selectedBrand === "Все" || car.name.startsWith(selectedBrand);
      return matchSearch && matchRarity && matchBrand;
    });
  }, [allCars, search, selectedRarity, selectedBrand]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>БОТ-КАТАЛОГ</Text>
          <Text style={styles.headerTitle}>ГАРАЖ</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsNum}>{filtered.length}</Text>
          <Text style={styles.statsLabel}>из {allCars.length}</Text>
        </View>
      </View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Поиск по названию..." placeholderTextColor={COLORS.textMuted} selectionColor={COLORS.accent} />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={{ color: COLORS.textMuted, fontSize: 14, padding: 4 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44, marginBottom: 4 }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: "center" }}>
        <TouchableOpacity style={[styles.filterBtn, selectedRarity === "all" && styles.filterBtnActive]} onPress={() => setSelectedRarity("all")}>
          <Text style={[styles.filterText, selectedRarity === "all" && { color: COLORS.accent }]}>ВСЕ</Text>
        </TouchableOpacity>
        {RARITIES.map(r => {
          const cfg = RARITY_CONFIG[r];
          const active = selectedRarity === r;
          return (
            <TouchableOpacity key={r} style={[styles.filterBtn, { borderColor: active ? cfg.color : cfg.color + "33" }, active && { backgroundColor: cfg.glow }]} onPress={() => setSelectedRarity(active ? "all" : r)}>
              <Text style={[styles.filterText, { color: active ? cfg.color : COLORS.textMuted }]}>{cfg.label.toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 36, marginBottom: SPACING.sm }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: "center" }}>
        {brands.slice(0, 25).map(brand => {
          const active = selectedBrand === brand;
          return (
            <TouchableOpacity key={brand} style={[styles.brandBtn, active && styles.brandBtnActive]} onPress={() => setSelectedBrand(brand)}>
              <Text style={[styles.brandText, active && { color: COLORS.accent }]}>{brand}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.countRow}>
        <View style={styles.countLine} />
        <Text style={styles.countText}>{filtered.length} машин</Text>
        <View style={styles.countLine} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item, i) => item.name + i}
        renderItem={({ item }) => <CarCard car={item} isCustom={item.isCustom} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 80, gap: SPACING.md }}>
            <Text style={{ fontSize: 48 }}>🏎️</Text>
            <Text style={{ color: COLORS.textSecondary, fontSize: 18, fontWeight: "700" }}>Машины не найдены</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>Попробуй изменить фильтры</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <AddCarModal visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={handleAddCar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  headerSub: { color: COLORS.accent, fontSize: 10, fontWeight: "700", letterSpacing: 4 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 32, fontWeight: "900", letterSpacing: 4, lineHeight: 36 },
  statsBox: { alignItems: "flex-end", backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: "#1E1E2E" },
  statsNum: { color: COLORS.accent, fontSize: 22, fontWeight: "900" },
  statsLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 1 },
  searchRow: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, borderWidth: 1, borderColor: "#1E1E2E", paddingHorizontal: SPACING.md, gap: SPACING.sm },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 15, paddingVertical: SPACING.md, fontWeight: "500" },
  filterBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 999, borderWidth: 1, borderColor: "#1E1E2E" },
  filterBtnActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accentGlow },
  filterText: { color: COLORS.textMuted, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  brandBtn: { paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: "#1E1E2E" },
  brandBtnActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accentGlow },
  brandText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: "600" },
  countRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.xl, marginBottom: SPACING.sm, gap: SPACING.md },
  countLine: { flex: 1, height: 1, backgroundColor: "#1E1E2E" },
  countText: { color: COLORS.textMuted, fontSize: 10, fontWeight: "600", letterSpacing: 1.5 },
  fab: { position: "absolute", bottom: 32, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.accent, alignItems: "center", justifyContent: "center", elevation: 8, shadowColor: COLORS.accent, shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 4 } },
  fabIcon: { color: COLORS.bg, fontSize: 30, fontWeight: "300", lineHeight: 34 },
});
