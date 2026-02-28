// colors.ts
export const lightColors = {
  background: "#FFFFFF",
  card: "#F8F9FA",
  text: "#111111",
  subText: "#666666",
  primary: "#ff3f6c",
  border: "#E0E0E0",
  error: "#FF3B30",
  success: "#34C759",
};

export const darkColors = {
  background: "#0F172A", // Deep Navy Slate
  card: "#1E293B",       // Slightly lighter slate
  text: "#F1F5F9",
  subText: "#94A3B8",
  primary: "#ff3f6c",    // Keeping your signature pink
  border: "#334155",
  error: "#FF453A",
  success: "#32D74B",
};

export type ThemeColors = typeof lightColors;