import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

axios.interceptors.request.use(
  async (config) => {
    try {
      const data = await AsyncStorage.getItem("user_data");

      if (data) {
        const user = JSON.parse(data);
        if (user.token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${user.token}`,
          };
        }
      }

      return config;
    } catch (error) {
      console.log("Axios interceptor error:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);