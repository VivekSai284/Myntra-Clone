import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";

export default function Orders() {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [orders, setorder] = useState<any>(null);

  useEffect(() => {
    const fetchorder = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const product = await axios.get(
            `https://myntra-clone-j4a9.onrender.com/order/user/${user._id}`
          );
          setorder(product.data);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchorder();
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!orders || orders.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
           <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.subText }}>No orders found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <ScrollView style={styles.content}>
        {orders.map((order: any) => (
          <View key={order._id} style={styles.orderCard}>
            <TouchableOpacity
              style={styles.orderHeader}
              onPress={() => toggleOrderDetails(order._id)}
            >
              <View>
                <Text style={styles.orderId}>Order #{order._id.slice(-8)}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.statusContainer}>
                <Ionicons name="cube-outline" size={16} color={theme.colors.success} />
                <Text style={styles.orderStatus}>{order.status}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.itemsContainer}>
              {order.items.map((item: any) => (
                <View key={item._id} style={styles.orderItem}>
                  <Image
                    source={{ uri: item.productId.images[0] }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.brandName}>{item.productId.brand}</Text>
                    <Text style={styles.itemName}>{item.productId.name}</Text>
                    <Text style={styles.itemPrice}>₹{item.productId.price}</Text>
                  </View>
                </View>
              ))}
            </View>

            {expandedOrder === order._id && (
              <View style={styles.orderDetails}>
                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="location-outline" size={20} color={theme.colors.text} />
                    <Text style={styles.detailTitle}>Shipping Address</Text>
                  </View>
                  <Text style={styles.detailText}>{order.shippingAddress}</Text>
                </View>

                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="card-outline" size={20} color={theme.colors.text} />
                    <Text style={styles.detailTitle}>Payment Method</Text>
                  </View>
                  <Text style={styles.detailText}>{order.paymentMethod}</Text>
                </View>

                {order.tracking && (
                  <View style={styles.detailSection}>
                    <View style={styles.detailHeader}>
                      <Ionicons name="car-outline" size={20} color={theme.colors.text} />
                      <Text style={styles.detailTitle}>Tracking Information</Text>
                    </View>
                    <View style={styles.trackingInfo}>
                      <Text style={styles.trackingNumber}>
                        Tracking Number: {order.tracking.number}
                      </Text>
                      <Text style={styles.trackingCarrier}>
                        Carrier: {order.tracking.carrier}
                      </Text>
                    </View>

                    <View style={styles.timeline}>
                      {order.tracking.timeline.map((event: any, index: any) => (
                        <View key={index} style={styles.timelineEvent}>
                          <View style={styles.timelinePoint} />
                          <View style={styles.timelineContent}>
                            <Text style={styles.timelineStatus}>{event.status}</Text>
                            <Text style={styles.timelineLocation}>{event.location}</Text>
                            <Text style={styles.timelineTimestamp}>{event.timestamp}</Text>
                          </View>
                          {index !== order.tracking.timeline.length - 1 && (
                            <View style={styles.timelineLine} />
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            <View style={styles.orderFooter}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalAmount}>₹{order.total}</Text>
              </View>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => toggleOrderDetails(order._id)}
              >
                <Text style={styles.detailsButtonText}>
                  {expandedOrder === order._id ? "Hide Details" : "View Details"}
                </Text>
                <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  orderCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: theme.colors.subText,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  orderStatus: {
    fontSize: 14,
    color: theme.colors.success,
    marginLeft: 5,
    fontWeight: '600',
  },
  itemsContainer: {
    padding: 15,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 5,
    backgroundColor: theme.colors.background,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  brandName: {
    fontSize: 14,
    color: theme.colors.subText,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  orderDetails: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: 10,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.subText,
    lineHeight: 20,
  },
  trackingInfo: {
    marginBottom: 15,
  },
  trackingNumber: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 5,
  },
  trackingCarrier: {
    fontSize: 14,
    color: theme.colors.subText,
  },
  timeline: {
    marginTop: 15,
  },
  timelineEvent: {
    flexDirection: "row",
    marginBottom: 20,
    position: "relative",
  },
  timelinePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginTop: 5,
    zIndex: 2,
  },
  timelineLine: {
    position: "absolute",
    left: 5,
    top: 17,
    width: 2,
    height: "100%",
    backgroundColor: theme.colors.border,
  },
  timelineContent: {
    marginLeft: 15,
    flex: 1,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 2,
  },
  timelineLocation: {
    fontSize: 14,
    color: theme.colors.subText,
    marginBottom: 2,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: theme.colors.subText,
  },
  orderFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: theme.colors.subText,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  detailsButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: 5,
    fontWeight: 'bold',
  },
});