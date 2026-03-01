import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import * as Linking from "expo-linking";

const BASE_URL = "https://myntra-clone-j4a9.onrender.com";

export default function Transactions() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTransactions = async (pageNumber = 1) => {
    if (!user) return;

    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await axios.get(`${BASE_URL}/api/transactions`, {
        params: {
          userId: user._id,
          page: pageNumber,
          limit: 10,
          status: statusFilter || undefined,
          sortBy: "createdAt",
          order: "desc",
        },
      });

      const newData = res.data.data;

      setTransactions((prev) =>
        pageNumber === 1 ? newData : [...prev, ...newData],
      );

      setTotalPages(res.data.pages);
      setPage(res.data.page);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setTransactions([]);
    fetchTransactions(1);
  }, [statusFilter]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.amount}>₹{item.amount}</Text>
        <Text
          style={[
            styles.status,
            {
              color:
                item.status?.toLowerCase() === "success"
                  ? theme.colors.success
                  : item.status?.toLowerCase() === "failed"
                    ? theme.colors.error
                    : theme.colors.text,
            },
          ]}
        >
          {item.status?.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.detail}>Payment Mode: {item.paymentMode}</Text>
      <Text style={styles.detail}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

      <TouchableOpacity
        style={styles.receiptBtn}
        onPress={() =>
          Linking.openURL(`${BASE_URL}/api/transactions/receipt/${item._id}`)
        }
      >
        <Text style={styles.receiptText}>Download Receipt</Text>
      </TouchableOpacity>
    </View>
  );

  const loadMore = () => {
    if (loadingMore) return;
    if (page >= totalPages) return;

    fetchTransactions(page + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Transactions</Text>
      <TouchableOpacity
        style={styles.exportBtn}
        onPress={() =>
          Linking.openURL(
            `${BASE_URL}/api/transactions/export/csv/${user?._id}`,
          )
        }
      >
        <Text style={styles.exportText}>Export CSV</Text>
      </TouchableOpacity>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {["ALL", "SUCCESS", "FAILED"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterBtn,
              statusFilter === status || (status === "ALL" && !statusFilter)
                ? styles.activeFilter
                : null,
            ]}
            onPress={() => setStatusFilter(status === "ALL" ? null : status)}
          >
            <Text style={styles.filterText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.colors.text,
    },
    card: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    amount: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    status: {
      fontWeight: "bold",
    },
    detail: {
      color: theme.colors.subText,
      marginBottom: 4,
    },
    receiptBtn: {
      marginTop: 8,
      backgroundColor: theme.colors.primary,
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    receiptText: {
      color: "#fff",
      fontWeight: "bold",
    },
    filterRow: {
      flexDirection: "row",
      marginBottom: 16,
      gap: 8,
    },
    filterBtn: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.border,
    },
    activeFilter: {
      backgroundColor: theme.colors.primary,
    },
    filterText: {
      color: theme.colors.text,
      fontWeight: "500",
    },
    pagination: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    pageBtn: {
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    pageInfo: {
      color: theme.colors.text,
    },
    exportBtn: {
      backgroundColor: theme.colors.primary,
      padding: 10,
      borderRadius: 8,
      alignSelf: "flex-start",
      marginBottom: 12,
    },
    exportText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
