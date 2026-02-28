import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";

export default function Wishlist() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [wishlist, setwishlist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchproduct(); }, [user]);

  const fetchproduct = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await axios.get(`https://myntra-clone-j4a9.onrender.com/wishlist/${user._id}`);
      setwishlist(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handledelete = async (itemid: any) => {
    try {
      await axios.delete(`https://myntra-clone-j4a9.onrender.com/wishlist/${itemid}`);
      fetchproduct();
    } catch (error) { console.log(error); }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}><Text style={styles.headerTitle}>Wishlist</Text></View>
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={80} color={theme.colors.subText} />
          <Text style={styles.emptyTitle}>Your wishlist is lonely. Login to see your picks!</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/login")}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Wishlist ({wishlist?.length || 0})</Text></View>
      <ScrollView style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : wishlist?.map((item: any) => (
          <View key={item._id} style={styles.wishlistItem}>
            <Image source={{ uri: item.productId.images[0] }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.brandName}>{item.productId.brand}</Text>
              <Text style={styles.itemName} numberOfLines={1}>{item.productId.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{item.productId.price}</Text>
                <Text style={styles.discount}>{item.productId.discount}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handledelete(item._id)}>
              <Ionicons name="close-circle" size={26} color={theme.colors.subText} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 15, paddingTop: 50, backgroundColor: theme.colors.background, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
  content: { flex: 1, padding: 15 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyTitle: { fontSize: 16, color: theme.colors.subText, textAlign: 'center', marginVertical: 20 },
  loginButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 40, paddingVertical: 12, borderRadius: 5 },
  loginButtonText: { color: "#fff", fontWeight: "bold" },
  wishlistItem: { flexDirection: "row", backgroundColor: theme.colors.card, borderRadius: 12, marginBottom: 15, overflow: "hidden", borderWidth: 1, borderColor: theme.colors.border },
  itemImage: { width: 110, height: 130 },
  itemInfo: { flex: 1, padding: 15, justifyContent: 'center' },
  brandName: { fontSize: 13, color: theme.colors.subText, fontWeight: 'bold', textTransform: 'uppercase' },
  itemName: { fontSize: 15, color: theme.colors.text, marginVertical: 4 },
  priceContainer: { flexDirection: "row", alignItems: "center" },
  price: { fontSize: 16, fontWeight: "bold", color: theme.colors.text, marginRight: 8 },
  discount: { fontSize: 13, color: theme.colors.primary, fontWeight: '600' },
  removeButton: { position: 'absolute', top: 10, right: 10 },
});