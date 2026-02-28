import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useTheme } from "@/hooks/useTheme";

export default function Signup() {
  const { Signup } = useAuth();
  const { syncWithServer } = useRecentlyViewed();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [isloading, setisloading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: "", email: "", password: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      try {
        setisloading(true);
        await Signup(formData.fullName, formData.email, formData.password);
        await syncWithServer();
        router.replace("/(tabs)");
      } catch (error) {
        console.error(error);
      } finally {
        setisloading(false);
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Image
        source={{
          uri: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        }}
        style={styles.backgroundImage}
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join Myntra and discover amazing fashion
        </Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.subText}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
          {errors.fullName ? (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor={theme.colors.subText}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor={theme.colors.subText}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={theme.colors.subText} 
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={isloading}
        >
          {isloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>SIGN UP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    backgroundImage: {
      width: "100%",
      height: 300,
      position: "absolute",
      top: 0,
    },
    formContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.opacity,
      marginTop: 250,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.subText,
      marginBottom: 30,
    },
    inputGroup: {
      marginBottom: 15,
    },
    input: {
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
      padding: 15,
      borderRadius: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputError: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    errorText: {
      color: theme.colors.primary,
      fontSize: 12,
      marginTop: 5,
      marginLeft: 5,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    passwordInput: {
      flex: 1,
      padding: 15,
      fontSize: 16,
      color: theme.colors.text,
    },
    eyeIcon: {
      padding: 15,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    loginLink: {
      marginTop: 20,
      alignItems: "center",
    },
    loginText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
  });