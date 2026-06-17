import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CatalogScreen from "./src/screens/CatalogScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Catalog" component={CatalogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
