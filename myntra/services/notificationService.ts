import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import axios from "axios";

export async function registerForPushNotifications(userId: string) {
  try {
    let token;

    if (!Device.isDevice) {
      alert("Must use physical device");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log("Expo Push Token:", token);

    // ✅ SEND TOKEN
    await axios.post(
      "https://myntra-clone-j4a9.onrender.com/api/notifications/register",
      {
        userId,
        token,
        platform: Platform.OS,
      }
    );

    // ✅ ANDROID CHANNEL
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  } catch (err) {
    console.log("Push registration error:", err);
  }
}