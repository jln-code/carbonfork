import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";

interface FoodWasteDisplayProps {
  wasteAmount: number;
  maxWaste: number;
}

export function FoodWasteDisplay({
  wasteAmount,
  maxWaste,
}: FoodWasteDisplayProps) {
  // Calculate waste percentage (0-1)
  const wastePercentage = Math.min(wasteAmount / maxWaste, 1);

  // Dynamic solid gradient based on waste level - green to yellow to orange to red
  const getWasteGradient = () => {
    if (wastePercentage < 0.25) {
      // Excellent - Pure green gradient
      return ["#10b981", "#059669", "#047857"];
    } else if (wastePercentage < 0.5) {
      // Good - Green to yellow gradient
      return ["#10b981", "#eab308", "#d97706"];
    } else if (wastePercentage < 0.75) {
      // Moderate - Yellow to orange gradient
      return ["#eab308", "#f97316", "#ea580c"];
    } else {
      // High waste - Orange to red gradient
      return ["#f97316", "#ef4444", "#dc2626"];
    }
  };

  const getWasteLevel = () => {
    if (wastePercentage < 0.25) return "Excellent";
    if (wastePercentage < 0.5) return "Good";
    if (wastePercentage < 0.75) return "Okay";
    return "Needs Improvement";
  };

  const getWasteLevelColor = () => {
    if (wastePercentage < 0.25) return "#4ade80";
    if (wastePercentage < 0.5) return "#facc15";
    if (wastePercentage < 0.75) return "#fb923c";
    return "#f87171";
  };

  // Generate cute carbon facts
  const getCuteFact = () => {
    const carbonSaved = (maxWaste - wasteAmount) * 2.1;
    const koalaNaps = Math.round(carbonSaved * 12.8); // Koalas sleep 18-22 hours
    const butterflyFlights = Math.round(carbonSaved * 156); // A butterfly's daily flight
    const catPurrs = Math.round(carbonSaved * 840); // A cat's hourly purrs

    const facts = [
      `${koalaNaps} koala naps 🐨`,
      `${butterflyFlights} butterfly flights 🦋`,
      `${catPurrs} kitty purrs 🐱`,
      `${Math.round(carbonSaved * 24)} puppy tail wags 🐶`,
      `${Math.round(carbonSaved * 3.6)} bunny hops 🐰`,
    ];

    return facts[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % facts.length]; // Daily rotation
  };

  return (
    <LinearGradient
      colors={getWasteGradient()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <View style={styles.content}>
        {/* Main waste display */}
        <View style={styles.mainDisplay}>
          <Text style={styles.displayTitle}>Food Waste Today</Text>
          <View style={styles.wasteAmountContainer}>
            <View style={styles.wasteAmountRow}>
              <Text style={styles.wasteAmount}>{wasteAmount.toFixed(1)}</Text>
              <Text style={styles.wasteUnit}>lbs</Text>
            </View>
            <Text style={[styles.wasteLevel, { color: getWasteLevelColor() }]}>
              {getWasteLevel()}
            </Text>
          </View>
        </View>

        {/* Carbon Impact with cute fact */}
        <View style={styles.carbonImpactContainer}>
          <View style={styles.carbonHeader}>
            <Icon name="leaf" size={20} color="#ffffff" />
            <Text style={styles.carbonTitle}>Carbon Saved</Text>
          </View>
          <Text style={styles.carbonAmount}>
            {((maxWaste - wasteAmount) * 2.1).toFixed(1)} kg CO₂
          </Text>
          <Text style={styles.carbonFact}>That's like {getCuteFact()}!</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  content: {
    gap: 24,
  },
  mainDisplay: {
    alignItems: "center",
    gap: 16,
  },
  displayTitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  wasteAmountContainer: {
    alignItems: "center",
    gap: 8,
  },
  wasteAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  wasteAmount: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
  },
  wasteUnit: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.6)",
  },
  wasteLevel: {
    fontSize: 18,
    fontWeight: "500",
  },
  carbonImpactContainer: {
    alignItems: "center",
    gap: 12,
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  carbonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  carbonTitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  carbonAmount: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "600",
  },
  carbonFact: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
});
