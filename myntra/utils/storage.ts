// storage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

// ==========================
// Save Data
// ==========================
export const setItem = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

// ==========================
// Get Data
// ==========================
export const getItem = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log("Error getting data:", error);
    return null;
  }
};

// ==========================
// Remove Data
// ==========================
export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Error removing data:", error);
  }
};

// ==========================
// Clear All Storage
// ==========================
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log("Error clearing storage:", error);
  }
};