import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleplaceorder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      await axios.post(
        `https://myntra-clone-j4a9.onrender.com/order/create/${user._id}`,
        {
          shippingAddress: "123 Main Street, Apt 4B, New York, NY, 10001",
          paymentMethod: "Card",
        }
      );
      router.push("/orders");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>

          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Full Name" defaultValue="John Doe" />
            <TextInput style={styles.input} placeholder="Address Line 1" defaultValue="123 Main Street" />
            <TextInput style={styles.input} placeholder="Address Line 2" defaultValue="Apt 4B" />

            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="City" defaultValue="New York" />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="State" defaultValue="NY" />
            </View>

            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Postal Code" defaultValue="10001" />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Country" defaultValue="United States" />
            </View>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Card Number" defaultValue="**** **** **** 4242" />

            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Expiry Date" defaultValue="12/25" />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="CVV" defaultValue="***" />
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹3,798</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>₹99</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>₹190</Text>
            </View>

            <View style={[styles.summaryRow, styles.total]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹4,087</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handleplaceorder}>
          <Text style={styles.placeOrderButtonText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    header: {
      padding: 15,
      paddingTop: 50,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },

    content: {
      flex: 1,
      padding: 15,
    },

    section: {
      marginBottom: 20,
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginLeft: 10,
    },

    form: {
      gap: 10,
    },

    input: {
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
      padding: 15,
      borderRadius: 10,
      fontSize: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    halfInput: {
      width: "48%",
    },

    summary: {
      gap: 10,
    },

    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
    },

    summaryLabel: {
      fontSize: 16,
      color: theme.colors.subText,
    },

    summaryValue: {
      fontSize: 16,
      color: theme.colors.text,
    },

    total: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      marginTop: 10,
      paddingTop: 10,
    },

    totalLabel: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },

    totalValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
    },

    footer: {
      padding: 15,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },

    placeOrderButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },

    placeOrderButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });