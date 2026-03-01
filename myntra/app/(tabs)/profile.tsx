import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ThemeToggle";

const menuItems = [
  { icon: "cube-outline", label: "Orders", route: "/orders" },
  { icon: "heart-outline", label: "Wishlist", route: "/wishlist" },
  { icon: "card-outline", label: "Payment Methods", route: "/payments" },
  { icon: "location-outline", label: "Addresses", route: "/addresses" },
  { icon: "receipt-outline", label: "Transactions", route: "/transactions" },
  { icon: "settings-outline", label: "Settings", route: "/settings" },
];

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { recentlyViewed } = useRecentlyViewed();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons
            name="person-circle-outline"
            size={80}
            color={theme.colors.primary}
          />
          <Text style={styles.emptyTitle}>
            Login to personalize your experience
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>LOGIN / SIGNUP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <View style={styles.leftUser}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>

          <ThemeToggle />
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={theme.colors.text}
                />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.subText}
              />
            </TouchableOpacity>
          ))}
        </View>

        {recentlyViewed.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <FlatList
              data={recentlyViewed}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.recentCard}>
                  <Image
                    source={{ uri: item.images?.[0] }}
                    style={styles.recentImage}
                  />
                  <Text numberOfLines={1} style={styles.recentName}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      padding: 15,
      paddingTop: 50,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
    content: { flex: 1 },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyTitle: {
      fontSize: 16,
      color: theme.colors.subText,
      marginVertical: 20,
      textAlign: "center",
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 4,
    },
    loginButtonText: { color: "#fff", fontWeight: "bold" },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.colors.card,
      margin: 15,
      borderRadius: 10,
      justifyContent: "space-between",
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    userDetails: { marginLeft: 15 },
    userName: { fontSize: 18, fontWeight: "bold", color: theme.colors.text },
    userEmail: { fontSize: 14, color: theme.colors.subText, marginTop: 2 },
    menuSection: {
      backgroundColor: theme.colors.card,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 18,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    menuItemLeft: { flexDirection: "row", alignItems: "center" },
    menuItemLabel: { fontSize: 15, color: theme.colors.text, marginLeft: 15 },
    recentSection: { marginTop: 25, paddingHorizontal: 15 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 15,
    },
    recentCard: { marginRight: 12, width: 100 },
    recentImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      backgroundColor: theme.colors.card,
    },
    recentName: { marginTop: 5, fontSize: 12, color: theme.colors.text },
    logoutButton: {
      margin: 20,
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      alignItems: "center",
    },
    logoutText: {
      color: theme.colors.primary,
      fontWeight: "bold",
      fontSize: 16,
    },
    leftUser: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
  });
