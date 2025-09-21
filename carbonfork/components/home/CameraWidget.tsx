import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";

export function CameraWidget() {
  const handleTakePhoto = () => {
    // Mock function - in a real app this would open camera
    Alert.alert(
      "Camera Feature",
      "Camera functionality would be implemented here using react-native-camera or expo-camera",
      [{ text: "OK" }]
    );
  };

  const handleHome = () => {
    console.log("Navigate to home");
  };

  const handleAccount = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Nav bar container */}
      <View style={styles.navContainer}>
        <View style={styles.navContent}>
          {/* Home button */}
          <TouchableOpacity onPress={handleHome} style={styles.navButton}>
            <Icon name="home" size={20} color="#ffffff" />
          </TouchableOpacity>

          {/* Main camera button - larger and prominent */}
          <TouchableOpacity
            onPress={handleTakePhoto}
            style={styles.cameraButtonContainer}>
            {/* Outer ring with pulse effect */}
            <View style={styles.pulseRing} />

            {/* Main button */}
            <LinearGradient
              colors={["#059669", "#047857"]}
              style={styles.cameraButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Icon name="camera" size={24} color="#ffffff" />
            </LinearGradient>

            {/* Plus indicator */}
            <View style={styles.plusIndicator}>
              <Icon name="plus" size={12} color="#059669" />
            </View>
          </TouchableOpacity>

          {/* Account button */}
          <TouchableOpacity onPress={handleAccount} style={styles.navButton}>
            <Icon name="log-out" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>Scan Food</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  navContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cameraButtonContainer: {
    position: "relative",
    marginHorizontal: 8,
  },
  pulseRing: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 28,
    backgroundColor: "rgba(16, 185, 129, 0.3)",
  },
  cameraButton: {
    padding: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  plusIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 2,
  },
  labelContainer: {
    marginTop: 8,
  },
  labelText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
