import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "user_data";

// ==========================
// Save User
// ==========================
export const saveUserData = async (
  id: string,
  name: string,
  email: string
) => {
  try {
    const user = { _id: id, name, email };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

// ==========================
// Get User
// ==========================
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.log("Error getting user:", error);
    return {};
  }
};

// ==========================
// Clear User
// ==========================
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.log("Error clearing user:", error);
  }
};