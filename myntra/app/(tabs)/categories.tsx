import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import axios from "axios";

export default function TabTwoScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setcategories] = useState<any>(null);

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        setIsLoading(true);
        const cat = await axios.get("https://myntra-clone-j4a9.onrender.com/category");
        setcategories(cat.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchproduct();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const filtercategories = categories?.filter((category: any) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedcategorydata = selectedCategory
    ? categories?.find((cat: any) => cat._id === selectedCategory)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Categories</Text></View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={theme.colors.subText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            placeholderTextColor={theme.colors.subText}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!selectedCategory ? (
          <View style={styles.categoriesGrid}>
            {filtercategories?.map((category: any) => (
              <TouchableOpacity key={category._id} style={styles.categoryCard} onPress={() => setSelectedCategory(category._id)}>
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.categoryDetail}>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.backButtonText}>← Back to Categories</Text>
            </TouchableOpacity>
            <Text style={styles.categoryTitle}>{selectedcategorydata?.name}</Text>
            <View style={styles.productsGrid}>
              {selectedcategorydata?.productId.map((product: any) => (
                <TouchableOpacity key={product._id} style={styles.productCard} onPress={() => router.push(`/product/${product._id}`)}>
                  <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.brandName}>{product.brand}</Text>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.price}>₹{product.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background },
  header: { padding: 15, paddingTop: 50, backgroundColor: theme.colors.background, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
  searchContainer: { padding: 15, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  searchInputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.card, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: theme.colors.border },
  searchInput: { flex: 1, fontSize: 16, color: theme.colors.text },
  searchIcon: { marginRight: 10 },
  content: { flex: 1 },
  categoriesGrid: { padding: 15 },
  categoryCard: { backgroundColor: theme.colors.card, borderRadius: 12, marginBottom: 15, overflow: "hidden", borderWidth: 1, borderColor: theme.colors.border },
  categoryImage: { width: "100%", height: 150 },
  categoryInfo: { padding: 15 },
  categoryName: { fontSize: 18, fontWeight: "bold", color: theme.colors.text },
  categoryDetail: { padding: 15 },
  backButtonText: { color: theme.colors.primary, fontSize: 16, marginBottom: 10 },
  categoryTitle: { fontSize: 24, fontWeight: "bold", color: theme.colors.text, marginBottom: 20 },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  productCard: { width: "48%", backgroundColor: theme.colors.card, borderRadius: 12, marginBottom: 15, overflow: "hidden", borderWidth: 1, borderColor: theme.colors.border },
  productImage: { width: "100%", height: 180 },
  productInfo: { padding: 10 },
  brandName: { fontSize: 12, color: theme.colors.subText },
  productName: { fontSize: 14, color: theme.colors.text, marginVertical: 4 },
  price: { fontSize: 16, fontWeight: "bold", color: theme.colors.text },
});