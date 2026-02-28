import React, { useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { toggleTheme, themeName, theme } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: themeName === "dark" ? 26 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
  }, [themeName]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={toggleTheme}
      style={[
        styles.switchContainer,
        {
          backgroundColor:
            themeName === "dark"
              ? theme.colors.primary
              : theme.colors.border,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ translateX }] },
        ]}
      >
        <View style={styles.iconWrap}>
          <Ionicons
            name={themeName === "dark" ? "moon" : "sunny"}
            size={14}
            color={theme.colors.primary}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  switchContainer: {
    width: 60,
    height: 32,
    borderRadius: 20,
    justifyContent: "center",
    padding: 3,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  iconWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
});