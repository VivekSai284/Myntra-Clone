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


const KEY = "recently_viewed";
const MAX = 20;

export const addRecentlyViewedLocal = async (product: any) => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    let list = data ? JSON.parse(data) : [];

    // remove duplicate
    list = list.filter((item: any) => item.id !== product._id);

    // add newest
    list.unshift({
      ...product,
      viewedAt: Date.now(),
    });

    // limit 20
    list = list.slice(0, MAX);

    await AsyncStorage.setItem(KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    console.log("Local recently viewed error", e);
    return [];
  }
};

export const getRecentlyViewedLocal = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const setRecentlyViewedLocal = async (list: any[]) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
};